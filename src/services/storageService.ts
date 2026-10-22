import { DocumentItem, ResearchSession, AppSettings } from '../types';
import { SAMPLE_DOCUMENTS, INITIAL_SAMPLE_SESSION } from '../data/sampleDocuments';

const STORAGE_KEYS = {
  DOCUMENTS: 'researchflow_documents_v1',
  SESSIONS: 'researchflow_sessions_v1',
  ACTIVE_SESSION_ID: 'researchflow_active_session_v1',
  ACTIVE_DOC_ID: 'researchflow_active_doc_v1',
  SETTINGS: 'researchflow_settings_v1'
};

const DEFAULT_SETTINGS: AppSettings = {
  aiMode: 'local-rag',
  autoScrollToCitation: true,
  theme: 'dark'
};

export const StorageService = {
  getDocuments(): DocumentItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      if (!stored) {
        // Initialize with high-quality sample documents
        this.saveDocuments(SAMPLE_DOCUMENTS);
        return SAMPLE_DOCUMENTS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse documents from localStorage, returning samples', e);
      return SAMPLE_DOCUMENTS;
    }
  },

  saveDocuments(docs: DocumentItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
    } catch (e) {
      console.error('Failed to save documents to localStorage', e);
    }
  },

  addDocument(doc: DocumentItem): DocumentItem[] {
    const docs = this.getDocuments();
    const existingIndex = docs.findIndex((d) => d.id === doc.id);
    let updated: DocumentItem[];
    if (existingIndex >= 0) {
      updated = [...docs];
      updated[existingIndex] = doc;
    } else {
      updated = [doc, ...docs];
    }
    this.saveDocuments(updated);
    return updated;
  },

  removeDocument(id: string): DocumentItem[] {
    const docs = this.getDocuments();
    const updated = docs.filter((d) => d.id !== id);
    this.saveDocuments(updated);
    return updated;
  },

  getSessions(): ResearchSession[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (!stored) {
        const initialSessions = [INITIAL_SAMPLE_SESSION];
        this.saveSessions(initialSessions);
        return initialSessions;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse sessions from localStorage', e);
      return [INITIAL_SAMPLE_SESSION];
    }
  },

  saveSessions(sessions: ResearchSession[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions to localStorage', e);
    }
  },

  saveSession(session: ResearchSession): ResearchSession[] {
    const sessions = this.getSessions();
    const index = sessions.findIndex((s) => s.id === session.id);
    let updated: ResearchSession[];
    if (index >= 0) {
      updated = [...sessions];
      updated[index] = { ...session, updatedAt: new Date().toISOString() };
    } else {
      updated = [{ ...session, updatedAt: new Date().toISOString() }, ...sessions];
    }
    this.saveSessions(updated);
    return updated;
  },

  deleteSession(id: string): ResearchSession[] {
    const sessions = this.getSessions();
    const updated = sessions.filter((s) => s.id !== id);
    this.saveSessions(updated);
    return updated;
  },

  getActiveSessionId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION_ID) || INITIAL_SAMPLE_SESSION.id;
  },

  setActiveSessionId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION_ID, id);
  },

  getActiveDocumentId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_DOC_ID) || 'doc-attention-2017';
  },

  setActiveDocumentId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_DOC_ID, id);
  },

  getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!stored) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  resetAllData(): { docs: DocumentItem[]; sessions: ResearchSession[] } {
    localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION_ID);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_DOC_ID);
    this.saveDocuments(SAMPLE_DOCUMENTS);
    this.saveSessions([INITIAL_SAMPLE_SESSION]);
    return { docs: SAMPLE_DOCUMENTS, sessions: [INITIAL_SAMPLE_SESSION] };
  },

  exportSessionToMarkdown(session: ResearchSession, docs: DocumentItem[]): void {
    const docTitles = session.documentIds
      .map((id) => docs.find((d) => d.id === id)?.title || id)
      .join(', ');

    let md = `# ResearchFlow Synthesis: ${session.title}\n\n`;
    md += `*Exported on: ${new Date().toLocaleString()}*\n`;
    md += `*Referenced Documents: ${docTitles}*\n\n`;
    md += `---\n\n`;

    session.messages.forEach((msg, idx) => {
      if (msg.role === 'user') {
        md += `### Research Inquiry ${Math.floor(idx / 2) + 1}\n`;
        md += `> ${msg.content}\n\n`;
      } else {
        md += `#### Evidence-Grounded Synthesis\n\n`;
        md += `${msg.content}\n\n`;

        if (msg.structuredAnswer) {
          md += `**Summary:**\n${msg.structuredAnswer.summary}\n\n`;
          if (msg.structuredAnswer.keyFindings?.length) {
            md += `**Key Findings:**\n`;
            msg.structuredAnswer.keyFindings.forEach((k) => {
              md += `- ${k}\n`;
            });
            md += `\n`;
          }
          if (msg.structuredAnswer.methodologyOrContext) {
            md += `**Methodology & Context:**\n${msg.structuredAnswer.methodologyOrContext}\n\n`;
          }
          if (msg.structuredAnswer.limitationsOrNuances) {
            md += `**Nuances & Limitations:**\n${msg.structuredAnswer.limitationsOrNuances}\n\n`;
          }
        }

        if (msg.citations && msg.citations.length > 0) {
          md += `**Source Citations & Evidence:**\n`;
          msg.citations.forEach((cit, cIdx) => {
            md += `[${cIdx + 1}] *${cit.documentTitle}*, Page ${cit.pageNumber} (${Math.round(cit.confidence * 100)}% match)\n`;
            md += `> "${cit.excerpt}"\n\n`;
          });
        }
        md += `---\n\n`;
      }
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${session.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_synthesis.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
