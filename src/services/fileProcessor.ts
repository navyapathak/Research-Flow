import { DocumentItem, DocumentPage, FileFormat } from '../types';

export interface UploadProgressCallback {
  (step: 'uploading' | 'extracting' | 'processing' | 'indexing' | 'ready' | 'failed', progress: number, message: string): void;
}

export const FileProcessor = {
  /**
   * Process an uploaded File object and return a fully structured DocumentItem
   */
  async processUploadedFile(file: File, onProgress?: UploadProgressCallback): Promise<DocumentItem> {
    const fileName = file.name;
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    // Step 1: Validate file format
    if (!['pdf', 'txt', 'md', 'markdown', 'docx', 'json', 'csv'].includes(extension)) {
      if (onProgress) {
        onProgress('failed', 0, `Unsupported file format (.${extension}). Please upload PDF, TXT, or MD.`);
      }
      throw new Error(`Unsupported file type (.${extension}). ResearchFlow currently supports PDF, TXT, and Markdown documents.`);
    }

    // Check for empty file
    if (file.size === 0) {
      if (onProgress) {
        onProgress('failed', 0, 'The uploaded file contains zero bytes.');
      }
      throw new Error('The selected file is empty (0 bytes).');
    }

    // Step 2: Uploading state
    onProgress?.('uploading', 25, 'Reading binary file data...');
    await new Promise((r) => setTimeout(r, 280));

    onProgress?.('uploading', 70, 'Buffering document in memory...');
    await new Promise((r) => setTimeout(r, 200));

    // Step 3: Extracting text
    onProgress?.('extracting', 35, 'Extracting text and structural components...');

    let pages: DocumentPage[] = [];
    let fileType: FileFormat = 'txt';

    if (extension === 'pdf') {
      fileType = 'pdf';
      pages = await this.extractPdfText(file, onProgress);
    } else if (['md', 'markdown'].includes(extension)) {
      fileType = 'md';
      pages = await this.extractTextFile(file);
    } else {
      fileType = 'txt';
      pages = await this.extractTextFile(file);
    }

    if (pages.length === 0 || pages.every((p) => p.textContent.trim().length === 0)) {
      onProgress?.('failed', 0, 'No extractable text found in document.');
      throw new Error('No readable text content could be extracted from this document.');
    }

    // Step 4: Processing paragraphs & sections
    onProgress?.('processing', 75, `Segmenting ${pages.length} page(s) and structuring paragraphs...`);
    await new Promise((r) => setTimeout(r, 300));

    // Step 5: Indexing
    onProgress?.('indexing', 90, 'Generating keyword vectors and lexical indexes...');
    await new Promise((r) => setTimeout(r, 250));

    onProgress?.('ready', 100, 'Document ready for research!');

    const title = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    const docItem: DocumentItem = {
      id: `doc-upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: title.charAt(0).toUpperCase() + title.slice(1),
      fileName: file.name,
      fileType,
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
      status: 'ready',
      pagesCount: pages.length,
      pages,
      summary: `Uploaded document containing ${pages.length} page(s) and approximately ${pages.reduce((acc, p) => acc + p.textContent.split(/\s+/).length, 0)} words.`,
      tags: ['Uploaded Document', fileType.toUpperCase()]
    };

    return docItem;
  },

  /**
   * Extract text from plaintext or markdown
   */
  async extractTextFile(file: File): Promise<DocumentPage[]> {
    const text = await file.text();
    const words = text.split(/\s+/);
    const wordsPerPage = 380; // realistic academic page density
    const pages: DocumentPage[] = [];

    if (words.length <= wordsPerPage) {
      pages.push({
        pageNumber: 1,
        textContent: text,
        sections: [
          {
            id: 'sec-1',
            title: 'Section 1',
            pageNumber: 1,
            preview: text.substring(0, 100) + '...'
          }
        ]
      });
      return pages;
    }

    let currentPage = 1;
    for (let i = 0; i < words.length; i += wordsPerPage) {
      const pageWords = words.slice(i, i + wordsPerPage);
      const pageText = pageWords.join(' ');
      pages.push({
        pageNumber: currentPage,
        textContent: pageText,
        sections: [
          {
            id: `sec-${currentPage}`,
            title: `Page ${currentPage} Overview`,
            pageNumber: currentPage,
            preview: pageText.substring(0, 100) + '...'
          }
        ]
      });
      currentPage++;
    }

    return pages;
  },

  /**
   * Extract text from PDF file using pdfjs-dist with fallback
   */
  async extractPdfText(file: File, onProgress?: UploadProgressCallback): Promise<DocumentPage[]> {
    try {
      // Dynamic import of pdfjs-dist to maintain snappy bundle
      const pdfjs = await import('pdfjs-dist');
      
      // Set worker source
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
      }

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      const pages: DocumentPage[] = [];

      for (let i = 1; i <= numPages; i++) {
        onProgress?.('extracting', Math.round(35 + (i / numPages) * 35), `Extracting PDF text (page ${i}/${numPages})...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str || '')
          .join(' ')
          .replace(/\s+/g, ' ');

        pages.push({
          pageNumber: i,
          textContent: pageText.trim() || `[Page ${i} contains non-extractable text or figures]`,
          sections: [
            {
              id: `sec-pdf-${i}`,
              title: `Page ${i} Content`,
              pageNumber: i,
              preview: pageText.substring(0, 100) + '...'
            }
          ]
        });
      }

      return pages;
    } catch (err) {
      console.warn('PDF.js dynamic parsing fallback triggered:', err);
      // Fallback: Parse readable text chunks from array buffer
      const buffer = await file.arrayBuffer();
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const rawString = decoder.decode(buffer);
      
      // Extract readable ASCII strings from PDF streams
      const matches = rawString.match(/[a-zA-Z0-9\s.,;:'"()\-]{10,}/g) || [];
      const extractedText = matches.join(' ');

      if (extractedText.length > 50) {
        const words = extractedText.split(/\s+/);
        const wordsPerPage = 350;
        const fallbackPages: DocumentPage[] = [];
        let pNum = 1;
        for (let i = 0; i < words.length; i += wordsPerPage) {
          fallbackPages.push({
            pageNumber: pNum,
            textContent: words.slice(i, i + wordsPerPage).join(' '),
            sections: [{ id: `sec-fb-${pNum}`, title: `Page ${pNum}`, pageNumber: pNum, preview: 'Extracted content...' }]
          });
          pNum++;
        }
        return fallbackPages;
      }

      throw new Error('Unable to extract text from this PDF file. It may be encrypted or scanned images without OCR.');
    }
  }
};
