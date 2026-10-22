import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DocumentReader } from './components/DocumentReader';
import { ResearchChat } from './components/ResearchChat';
import { DocumentLibrary } from './components/DocumentLibrary';
import { SessionsView } from './components/SessionsView';
import { CaseStudyModal } from './components/CaseStudyModal';
import { UploadModal } from './components/UploadModal';
import { SettingsModal } from './components/SettingsModal';

import { StorageService } from './services/storageService';
import { ResearchEngine } from './services/researchEngine';
import { 
  DocumentItem, 
  ResearchSession, 
  Citation, 
  HighlightTarget, 
  AppSettings,
  ChatMessage
} from './types';
import './App.css';

export function App() {
  // Core State
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [sessions, setSessions] = useState<ResearchSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(StorageService.getSettings());

  // Workspace Splitter & Panes
  const [splitRatio, setSplitRatio] = useState<number>(54); // 54% reader, 46% chat
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'workspace' | 'library' | 'sessions' | 'casestudy'>('workspace');
  const [mobilePane, setMobilePane] = useState<'reader' | 'chat'>('reader');

  // Modals & Dynamic UI
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isLoadingQuery, setIsLoadingQuery] = useState<boolean>(false);
  const [highlightTarget, setHighlightTarget] = useState<HighlightTarget | null>(null);

  // Initialize from storage on mount
  useEffect(() => {
    const loadedDocs = StorageService.getDocuments();
    const loadedSessions = StorageService.getSessions();
    const currentSessionId = StorageService.getActiveSessionId();
    const currentDocId = StorageService.getActiveDocumentId();

    setDocuments(loadedDocs);
    setSessions(loadedSessions);

    if (loadedSessions.some((s) => s.id === currentSessionId)) {
      setActiveSessionId(currentSessionId);
    } else if (loadedSessions.length > 0) {
      setActiveSessionId(loadedSessions[0].id);
    }

    if (loadedDocs.some((d) => d.id === currentDocId)) {
      setActiveDocId(currentDocId);
    } else if (loadedDocs.length > 0) {
      setActiveDocId(loadedDocs[0].id);
    }
  }, []);

  // Active Session & Active Document
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0] || null;
  const activeDocument = documents.find((d) => d.id === activeDocId) || documents[0] || null;

  // Selected Documents in the current research session scope
  const selectedDocIds = activeSession?.documentIds || [];
  const activeScopeDocuments = documents.filter((d) => selectedDocIds.includes(d.id));

  // Change Active Document
  const handleSelectDoc = useCallback((docId: string) => {
    setActiveDocId(docId);
    StorageService.setActiveDocumentId(docId);
  }, []);

  // Change Active Session
  const handleSelectSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
    StorageService.setActiveSessionId(sessionId);
  }, []);

  // Toggle Document in Session Scope
  const handleToggleDocInSession = useCallback((docId: string) => {
    if (!activeSession) return;
    const currentIds = activeSession.documentIds || [];
    const newIds = currentIds.includes(docId)
      ? currentIds.filter((id) => id !== docId)
      : [...currentIds, docId];

    const updatedSession: ResearchSession = {
      ...activeSession,
      documentIds: newIds
    };

    const updatedSessions = StorageService.saveSession(updatedSession);
    setSessions(updatedSessions);
  }, [activeSession]);

  // Rename Session Title
  const handleUpdateSessionTitle = useCallback((newTitle: string) => {
    if (!activeSession) return;
    const updatedSession: ResearchSession = {
      ...activeSession,
      title: newTitle
    };
    const updatedSessions = StorageService.saveSession(updatedSession);
    setSessions(updatedSessions);
  }, [activeSession]);

  // Create New Research Session
  const handleNewSession = useCallback(() => {
    const defaultDocIds = activeDocId ? [activeDocId] : (documents[0] ? [documents[0].id] : []);
    const newSession: ResearchSession = {
      id: `session-${Date.now()}`,
      title: `Research Session #${sessions.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documentIds: defaultDocIds,
      messages: []
    };

    const updated = StorageService.saveSession(newSession);
    setSessions(updated);
    setActiveSessionId(newSession.id);
    StorageService.setActiveSessionId(newSession.id);
    setActiveTab('workspace');
  }, [activeDocId, documents, sessions.length]);

  // Delete Session
  const handleDeleteSession = useCallback((id: string) => {
    const updated = StorageService.deleteSession(id);
    setSessions(updated);
    if (activeSessionId === id && updated.length > 0) {
      setActiveSessionId(updated[0].id);
      StorageService.setActiveSessionId(updated[0].id);
    }
  }, [activeSessionId]);

  // Delete Document
  const handleDeleteDoc = useCallback((id: string) => {
    const updatedDocs = StorageService.removeDocument(id);
    setDocuments(updatedDocs);
    if (activeDocId === id) {
      const nextDoc = updatedDocs[0] || null;
      setActiveDocId(nextDoc ? nextDoc.id : null);
    }
  }, [activeDocId]);

  // Upload Complete
  const handleDocumentUploaded = useCallback((newDoc: DocumentItem) => {
    const updatedDocs = StorageService.addDocument(newDoc);
    setDocuments(updatedDocs);
    setActiveDocId(newDoc.id);
    StorageService.setActiveDocumentId(newDoc.id);

    // Auto add to active session
    if (activeSession && !activeSession.documentIds.includes(newDoc.id)) {
      const updatedSession: ResearchSession = {
        ...activeSession,
        documentIds: [...activeSession.documentIds, newDoc.id]
      };
      setSessions(StorageService.saveSession(updatedSession));
    }

    setActiveTab('workspace');
  }, [activeSession]);

  // Restore Sample Papers
  const handleResetData = useCallback(() => {
    const { docs, sessions: newSessions } = StorageService.resetAllData();
    setDocuments(docs);
    setSessions(newSessions);
    setActiveSessionId(newSessions[0].id);
    setActiveDocId(docs[0].id);
    setHighlightTarget(null);
  }, []);

  // Citation Click -> Jump to Reader & Highlight
  const handleSelectCitation = useCallback((citation: Citation) => {
    // 1. Switch document if needed
    if (activeDocId !== citation.documentId) {
      handleSelectDoc(citation.documentId);
    }

    // 2. Set highlight target
    setHighlightTarget({
      documentId: citation.documentId,
      pageNumber: citation.pageNumber,
      excerptText: citation.excerpt,
      citationId: citation.id
    });

    // 3. Ensure workspace tab is active
    if (activeTab !== 'workspace') {
      setActiveTab('workspace');
    }

    // 4. On mobile, switch to reader pane
    setMobilePane('reader');
  }, [activeDocId, activeTab, handleSelectDoc]);

  // Send Message Query
  const handleSendMessage = async (queryText: string) => {
    if (!activeSession) return;

    // Build user message
    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      timestamp: new Date().toISOString(),
      content: queryText
    };

    const currentMessages = [...activeSession.messages, userMessage];
    const sessionWithUserMsg: ResearchSession = {
      ...activeSession,
      messages: currentMessages,
      updatedAt: new Date().toISOString()
    };

    setSessions(StorageService.saveSession(sessionWithUserMsg));
    setIsLoadingQuery(true);

    try {
      // Determine documents in scope (fallback to all documents if none selected)
      const targetDocs = activeScopeDocuments.length > 0 ? activeScopeDocuments : documents;

      // Run intelligent grounded RAG engine
      const result = await ResearchEngine.processQuery(queryText, targetDocs, {
        geminiApiKey: settings.aiMode === 'gemini-api' ? settings.geminiApiKey : undefined
      });

      const assistantMessage: ChatMessage = {
        id: `msg-asst-${Date.now()}`,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        content: result.content,
        structuredAnswer: result.structuredAnswer,
        citations: result.citations,
        suggestedFollowUps: result.suggestedFollowUps
      };

      const finalMessages = [...currentMessages, assistantMessage];
      const finalSession: ResearchSession = {
        ...activeSession,
        messages: finalMessages,
        updatedAt: new Date().toISOString()
      };

      setSessions(StorageService.saveSession(finalSession));
    } catch (err) {
      console.error('Query processing error:', err);
      const errorMessage: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        content: 'An unexpected error occurred while analyzing the documents. Please verify your document index and try again.',
        isError: true
      };
      const finalSession: ResearchSession = {
        ...activeSession,
        messages: [...currentMessages, errorMessage],
        updatedAt: new Date().toISOString()
      };
      setSessions(StorageService.saveSession(finalSession));
    } finally {
      setIsLoadingQuery(false);
    }
  };

  // Export session to Markdown
  const handleExportSession = useCallback(() => {
    if (activeSession) {
      StorageService.exportSessionToMarkdown(activeSession, documents);
    }
  }, [activeSession, documents]);

  // Ask about selected text from reader
  const handleAskAboutExcerpt = useCallback((excerpt: string) => {
    const prompt = `Based on the following excerpt from ${activeDocument?.title || 'the paper'}, what is its significance?\n\n"${excerpt}"`;
    handleSendMessage(prompt);
    setMobilePane('chat');
  }, [activeDocument?.title]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      backgroundColor: 'var(--bg-main)',
      overflow: 'hidden'
    }}>
      {/* Top Navbar */}
      <Navbar
        activeSession={activeSession}
        onUpdateSessionTitle={handleUpdateSessionTitle}
        onNewSession={handleNewSession}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExportSession={handleExportSession}
        activeDocuments={activeScopeDocuments.length > 0 ? activeScopeDocuments : documents}
        settings={settings}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Body */}
      <div style={{
        display: 'flex',
        flex: 1,
        height: 'calc(100vh - 60px)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Collapsible Sidebar */}
        <Sidebar
          sessions={sessions}
          activeSession={activeSession}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
          documents={documents}
          activeDocId={activeDocId}
          onSelectDoc={handleSelectDoc}
          selectedDocIds={selectedDocIds}
          onToggleDocInSession={handleToggleDocInSession}
          onLoadSamples={handleResetData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        {/* View Switcher */}
        {activeTab === 'library' && (
          <DocumentLibrary
            documents={documents}
            activeDocId={activeDocId}
            selectedDocIds={selectedDocIds}
            onSelectDoc={handleSelectDoc}
            onToggleDocInSession={handleToggleDocInSession}
            onDeleteDoc={handleDeleteDoc}
            onOpenUpload={() => setIsUploadOpen(true)}
            onLoadSamples={handleResetData}
            onNavigateToWorkspace={() => setActiveTab('workspace')}
          />
        )}

        {activeTab === 'sessions' && (
          <SessionsView
            sessions={sessions}
            activeSession={activeSession}
            documents={documents}
            onSelectSession={handleSelectSession}
            onDeleteSession={handleDeleteSession}
            onNewSession={handleNewSession}
            onNavigateToWorkspace={() => setActiveTab('workspace')}
          />
        )}

        {activeTab === 'casestudy' && (
          <CaseStudyModal />
        )}

        {/* Core Workspace View: High Quality Split Screen */}
        {activeTab === 'workspace' && (
          <main style={{
            display: 'flex',
            flex: 1,
            height: '100%',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* Mobile Pane Switcher (visible on narrow screens < 900px) */}
            <div className="mobile-pane-toggle" style={{
              display: 'none',
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 50,
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-full)',
              padding: '4px',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <button
                onClick={() => setMobilePane('reader')}
                className={`btn btn-sm ${mobilePane === 'reader' ? 'btn-primary' : 'btn-ghost'}`}
              >
                Document Reader
              </button>
              <button
                onClick={() => setMobilePane('chat')}
                className={`btn btn-sm ${mobilePane === 'chat' ? 'btn-primary' : 'btn-ghost'}`}
              >
                Research Chat
              </button>
            </div>

            {/* Left Panel: Document Reader */}
            <div 
              className={`workspace-panel reader-panel ${mobilePane === 'reader' ? 'mobile-active' : ''}`}
              style={{
                width: `${splitRatio}%`,
                height: '100%',
                overflow: 'hidden'
              }}
            >
              <DocumentReader
                document={activeDocument}
                highlightTarget={highlightTarget}
                onClearHighlight={() => setHighlightTarget(null)}
                onAskAboutExcerpt={handleAskAboutExcerpt}
              />
            </div>

            {/* Splitter Divider */}
            <div
              style={{
                width: '6px',
                cursor: 'col-resize',
                backgroundColor: 'var(--border-subtle)',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 25
              }}
              className="workspace-splitter"
              onMouseDown={(e) => {
                e.preventDefault();
                const startX = e.clientX;
                const startRatio = splitRatio;

                const onMouseMove = (moveEvent: MouseEvent) => {
                  const deltaX = moveEvent.clientX - startX;
                  const containerWidth = window.innerWidth - (isSidebarCollapsed ? 52 : 280);
                  const deltaRatio = (deltaX / containerWidth) * 100;
                  const newRatio = Math.min(75, Math.max(30, startRatio + deltaRatio));
                  setSplitRatio(newRatio);
                };

                const onMouseUp = () => {
                  window.removeEventListener('mousemove', onMouseMove);
                  window.removeEventListener('mouseup', onMouseUp);
                };

                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseup', onMouseUp);
              }}
              title="Drag to resize panels"
            >
              <div style={{ width: '2px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '1px' }} />
            </div>

            {/* Right Panel: Research Conversation */}
            <div 
              className={`workspace-panel chat-panel ${mobilePane === 'chat' ? 'mobile-active' : ''}`}
              style={{
                width: `${100 - splitRatio}%`,
                height: '100%',
                overflow: 'hidden'
              }}
            >
              <ResearchChat
                messages={activeSession?.messages || []}
                onSendMessage={handleSendMessage}
                isLoading={isLoadingQuery}
                activeDocuments={activeScopeDocuments.length > 0 ? activeScopeDocuments : documents}
                onSelectCitation={handleSelectCitation}
                onSelectDocument={handleSelectDoc}
              />
            </div>
          </main>
        )}
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDocumentUploaded={handleDocumentUploaded}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(s) => {
          setSettings(s);
          StorageService.saveSettings(s);
        }}
        onResetData={handleResetData}
        sessions={sessions}
        documents={documents}
      />
    </div>
  );
}

export default App;
