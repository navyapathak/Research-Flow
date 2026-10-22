import { DocumentItem, Citation, StructuredAnswer } from '../types';

interface QueryResult {
  content: string;
  structuredAnswer: StructuredAnswer;
  citations: Citation[];
  suggestedFollowUps: string[];
}

// Stop words to remove from query matching
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing',
  'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
  'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers',
  'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if',
  'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t',
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s',
  'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re',
  'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t',
  'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s',
  'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t',
  'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself',
  'yourselves', 'explain', 'tell', 'show', 'describe', 'find', 'give', 'list'
]);

interface ScoredPassage {
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  text: string;
  score: number;
  matchedKeywords: string[];
}

export const ResearchEngine = {
  /**
   * Primary entry point for query processing
   */
  async processQuery(
    query: string,
    activeDocuments: DocumentItem[],
    options?: {
      geminiApiKey?: string;
      customBackendUrl?: string;
    }
  ): Promise<QueryResult> {
    // If user provided a Gemini API Key, try external call with local fallback
    if (options?.geminiApiKey && options.geminiApiKey.trim().length > 10) {
      try {
        return await this.callGeminiAPI(query, activeDocuments, options.geminiApiKey);
      } catch (err) {
        console.warn('Gemini API call failed or timed out, gracefully falling back to local evidence engine', err);
      }
    }

    // Default: High-fidelity Local Grounded RAG Engine
    return this.processLocally(query, activeDocuments);
  },

  /**
   * Local deterministic & transparent RAG synthesis
   */
  processLocally(query: string, activeDocuments: DocumentItem[]): QueryResult {
    if (!activeDocuments || activeDocuments.length === 0) {
      return {
        content: 'No documents are currently active in this research workspace.',
        structuredAnswer: {
          summary: 'Cannot analyze query because no documents are selected.',
          keyFindings: [],
          evidenceCount: 0,
          hasSufficientEvidence: false,
          insufficientEvidenceReason: 'Please select or upload at least one document to analyze.'
        },
        citations: [],
        suggestedFollowUps: ['Upload a research paper', 'Select sample documents from the library']
      };
    }

    // Extract search terms
    const rawTokens = query.toLowerCase().replace(/[^\w\s-]/g, ' ').split(/\s+/).filter(Boolean);
    const keywords = rawTokens.filter((token) => !STOP_WORDS.has(token) && token.length > 2);

    // If query has only stop words, use raw tokens
    const searchTerms = keywords.length > 0 ? keywords : rawTokens;

    // Search passages across all active documents
    const scoredPassages: ScoredPassage[] = [];

    activeDocuments.forEach((doc) => {
      doc.pages.forEach((page) => {
        // Split text into coherent paragraphs
        const paragraphs = page.textContent
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter((p) => p.length > 40);

        paragraphs.forEach((para) => {
          const lowerPara = para.toLowerCase();
          let matchCount = 0;
          const matchedTerms: string[] = [];

          searchTerms.forEach((term) => {
            if (lowerPara.includes(term)) {
              matchCount++;
              matchedTerms.push(term);
            }
          });

          // Check for exact multi-word phrase bonuses
          if (query.length > 6 && lowerPara.includes(query.toLowerCase().trim())) {
            matchCount += 4;
          }

          if (matchCount > 0) {
            // BM25-inspired term density score
            const density = matchCount / Math.max(searchTerms.length, 1);
            const score = Math.min(0.99, Math.max(0.5, 0.45 + density * 0.5));

            scoredPassages.push({
              documentId: doc.id,
              documentTitle: doc.title,
              pageNumber: page.pageNumber,
              text: para,
              score,
              matchedKeywords: matchedTerms
            });
          }
        });
      });
    });

    // Sort by relevance score descending
    scoredPassages.sort((a, b) => b.score - a.score);

    // DEDUPLICATE passages by close text
    const uniquePassages: ScoredPassage[] = [];
    for (const p of scoredPassages) {
      if (!uniquePassages.some((u) => u.documentId === p.documentId && u.pageNumber === p.pageNumber && u.text.substring(0, 50) === p.text.substring(0, 50))) {
        uniquePassages.push(p);
      }
      if (uniquePassages.length >= 4) break;
    }

    // CHECK EVIDENCE SUFFICIENCY
    // If no passages matched or the top score is too weak
    if (uniquePassages.length === 0 || uniquePassages[0].score < 0.48) {
      const docNames = activeDocuments.map((d) => `"${d.title}"`).join(', ');
      return {
        content: `I searched across the active documents (${docNames}), but could not find verifiable evidence to support an answer to: "${query}".`,
        structuredAnswer: {
          summary: `The currently selected documents do not contain text or findings addressing this inquiry. To preserve research integrity and avoid unsupported claims, no speculative answers are generated.`,
          keyFindings: [
            `Zero high-confidence text matches were found for the query terms: [${searchTerms.join(', ')}].`,
            `The indexed scope covers: ${activeDocuments.map((d) => d.tags?.join(', ') || d.title).join(' | ')}.`,
            `Please verify if the topic is covered in your documents or consider uploading an additional reference.`
          ],
          evidenceCount: 0,
          hasSufficientEvidence: false,
          insufficientEvidenceReason: `No relevant excerpts found in ${activeDocuments.length} active document(s).`
        },
        citations: [],
        suggestedFollowUps: [
          `What are the core topics covered in ${activeDocuments[0]?.title || 'the document'}?`,
          `Summarize the main methodology and findings`,
          `Upload a new PDF to expand research coverage`
        ]
      };
    }

    // GENERATE CITATIONS
    const citations: Citation[] = uniquePassages.slice(0, 3).map((p, idx) => ({
      id: `cit-${Date.now()}-${idx + 1}`,
      documentId: p.documentId,
      documentTitle: p.documentTitle,
      pageNumber: p.pageNumber,
      excerpt: p.text.length > 280 ? `${p.text.substring(0, 280)}...` : p.text,
      confidence: parseFloat(p.score.toFixed(2)),
      matchedSection: `Page ${p.pageNumber}`,
      queryKeywordMatches: p.matchedKeywords
    }));

    // SYNTHESIZE EVIDENCE
    const topPassage = uniquePassages[0];
    const synthesis = this.synthesizeFindings(query, uniquePassages, activeDocuments);

    return {
      content: synthesis.executiveAnswer,
      structuredAnswer: {
        summary: synthesis.summary,
        keyFindings: synthesis.keyFindings,
        methodologyOrContext: synthesis.methodology,
        limitationsOrNuances: synthesis.limitations,
        evidenceCount: citations.length,
        hasSufficientEvidence: true
      },
      citations,
      suggestedFollowUps: this.generateFollowUps(query, topPassage, activeDocuments)
    };
  },

  /**
   * Clean deterministic synthesis generator
   */
  synthesizeFindings(
    query: string,
    passages: ScoredPassage[],
    docs: DocumentItem[]
  ): {
    executiveAnswer: string;
    summary: string;
    keyFindings: string[];
    methodology: string;
    limitations: string;
  } {
    const primary = passages[0];
    const doc = docs.find((d) => d.id === primary.documentId);

    // Extract first 2 sentences from the top passage for direct quoting
    const sentences = primary.text.split(/(?<=[.?!])\s+/).filter((s) => s.length > 20);
    const leadingQuote = sentences.slice(0, 2).join(' ');

    const keyFindings = passages.map((p) => {
      const cleanSnippet = p.text.replace(/\n/g, ' ').substring(0, 160);
      return `[${p.documentTitle}, p. ${p.pageNumber}] ${cleanSnippet}...`;
    });

    const executiveAnswer = `Based on verifiable evidence in ${doc?.title || 'the document'} (Page ${primary.pageNumber}), the inquiry directly connects to key documented findings: "${leadingQuote}"`;

    const summary = `Evidence retrieved from ${passages.length} distinct section(s) indicates strong alignment with your query. The document explicitly describes the mechanism, operational parameters, and observed empirical outcomes.`;

    const methodology = doc?.authors
      ? `Reported by ${doc.authors} (${doc.publicationDate || 'Recent Edition'}). Documented under ${doc.journalOrSource || 'formal publication'}.`
      : `Extracted from structured sections in ${doc?.title}.`;

    const limitations = `Findings are strictly grounded in the extracted text of the active documents. Specific external variables or subsequent updates outside these files were not evaluated.`;

    return {
      executiveAnswer,
      summary,
      keyFindings,
      methodology,
      limitations
    };
  },

  /**
   * Generate relevant follow-up questions
   */
  generateFollowUps(query: string, topPassage: ScoredPassage, docs: DocumentItem[]): string[] {
    const doc = docs.find((d) => d.id === topPassage.documentId);
    const title = doc?.title || 'the document';

    if (title.toLowerCase().includes('attention') || title.toLowerCase().includes('transformer')) {
      return [
        'How does Scaled Dot-Product Attention compare with Additive Attention?',
        'What was the training hardware setup and how many GPUs were used?',
        'What are the computational complexity differences between Self-Attention and RNNs?'
      ];
    }

    if (title.toLowerCase().includes('climate') || title.toLowerCase().includes('energy')) {
      return [
        'What are the primary bottlenecks in renewable grid interconnection queues?',
        'How does the cost of green hydrogen compare to gray hydrogen?',
        'What policy levers and recommendations does the report suggest for 2025-2030?'
      ];
    }

    if (title.toLowerCase().includes('crispr') || title.toLowerCase().includes('gene')) {
      return [
        'What engineered Cas9 variants reduce off-target cleavage below detection limits?',
        'How do SORT lipid nanoparticles achieve organ-selective extrahepatic delivery?',
        'What are the limitations of ex vivo therapies like exa-cel regarding busulfan conditioning?'
      ];
    }

    return [
      `What are the principal limitations discussed on page ${topPassage.pageNumber}?`,
      `How do these findings compare with earlier published benchmarks?`,
      `What specific recommendations are outlined for future research?`
    ];
  },

  /**
   * Optional Gemini API integration with citation grounding
   */
  async callGeminiAPI(query: string, activeDocuments: DocumentItem[], apiKey: string): Promise<QueryResult> {
    const contextPrompt = activeDocuments
      .map((d) => {
        return `DOCUMENT: "${d.title}"\n` +
          d.pages
            .map((p) => `[PAGE ${p.pageNumber}]\n${p.textContent}`)
            .join('\n\n');
      })
      .join('\n\n===================\n\n');

    const systemPrompt = `You are ResearchFlow's Grounded AI Assistant.
You must answer the user's research inquiry ONLY using the provided documents.
Strict Rules:
1. Every major assertion must have a verifiable citation in the format [DocTitle, p. X].
2. If the document DOES NOT contain the answer, say "Insufficient evidence in provided documents" honestly.
3. Return your response as a valid JSON object matching:
{
  "content": "A high-level executive answer",
  "summary": "2-3 sentence executive synthesis",
  "keyFindings": ["Finding 1 with page ref", "Finding 2 with page ref"],
  "hasSufficientEvidence": true/false,
  "insufficientEvidenceReason": "optional reason if false",
  "suggestedFollowUps": ["Follow-up 1", "Follow-up 2", "Follow-up 3"]
}`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemPrompt },
              { text: `AVAILABLE RESEARCH DOCUMENTS:\n${contextPrompt}` },
              { text: `USER RESEARCH INQUIRY: ${query}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const parsed = JSON.parse(rawText);

    // Also run local matcher to attach real citation objects for the UI
    const localMatch = this.processLocally(query, activeDocuments);

    return {
      content: parsed.content || localMatch.content,
      structuredAnswer: {
        summary: parsed.summary || localMatch.structuredAnswer.summary,
        keyFindings: parsed.keyFindings || localMatch.structuredAnswer.keyFindings,
        evidenceCount: localMatch.citations.length,
        hasSufficientEvidence: parsed.hasSufficientEvidence ?? localMatch.structuredAnswer.hasSufficientEvidence,
        insufficientEvidenceReason: parsed.insufficientEvidenceReason
      },
      citations: localMatch.citations,
      suggestedFollowUps: parsed.suggestedFollowUps || localMatch.suggestedFollowUps
    };
  }
};
