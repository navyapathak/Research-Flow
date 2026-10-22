export type DocumentStatus =
  | 'uploading'
  | 'extracting'
  | 'processing'
  | 'indexing'
  | 'ready'
  | 'failed'
  | 'unsupported'
  | 'empty';

export type FileFormat = 'pdf' | 'txt' | 'md' | 'docx';

export interface DocumentSection {
  id: string;
  title: string;
  pageNumber: number;
  preview: string;
}

export interface DocumentPage {
  pageNumber: number;
  textContent: string;
  sections?: DocumentSection[];
}

export interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  fileType: FileFormat;
  fileSize: number; // in bytes
  uploadDate: string; // ISO string
  status: DocumentStatus;
  progress?: number; // 0-100
  statusMessage?: string;
  pagesCount: number;
  pages: DocumentPage[];
  summary?: string;
  authors?: string;
  publicationDate?: string;
  journalOrSource?: string;
  tags?: string[];
  errorMessage?: string;
}

export interface Citation {
  id: string;
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  excerpt: string;
  confidence: number; // 0.0 - 1.0 (e.g. 0.94 = 94% confidence)
  matchedSection?: string;
  queryKeywordMatches?: string[];
}

export interface StructuredAnswer {
  summary: string;
  keyFindings: string[];
  methodologyOrContext?: string;
  limitationsOrNuances?: string;
  evidenceCount: number;
  hasSufficientEvidence: boolean;
  insufficientEvidenceReason?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  timestamp: string;
  content: string;
  structuredAnswer?: StructuredAnswer;
  citations?: Citation[];
  suggestedFollowUps?: string[];
  isStreaming?: boolean;
  isError?: boolean;
}

export interface ResearchSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  documentIds: string[]; // documents attached to this research session
  messages: ChatMessage[];
  notes?: string;
}

export interface AppSettings {
  aiMode: 'local-rag' | 'gemini-api' | 'custom-backend';
  geminiApiKey?: string;
  backendEndpoint?: string;
  autoScrollToCitation: boolean;
  theme: 'dark' | 'midnight';
}

export interface HighlightTarget {
  documentId: string;
  pageNumber: number;
  excerptText: string;
  citationId?: string;
}
