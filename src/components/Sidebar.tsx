import React from 'react';
import { 
  FileText, 
  Layers, 
  Clock, 
  Trash2, 
  CheckSquare, 
  Square, 
  RefreshCw,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Database,
  ExternalLink
} from 'lucide-react';
import { ResearchSession, DocumentItem } from '../types';

interface SidebarProps {
  sessions: ResearchSession[];
  activeSession: ResearchSession | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  documents: DocumentItem[];
  activeDocId: string | null;
  onSelectDoc: (id: string) => void;
  selectedDocIds: string[];
  onToggleDocInSession: (id: string) => void;
  onLoadSamples: () => void;
  activeTab: 'workspace' | 'library' | 'sessions' | 'casestudy';
  setActiveTab: (tab: 'workspace' | 'library' | 'sessions' | 'casestudy') => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSession,
  onSelectSession,
  onDeleteSession,
  documents,
  activeDocId,
  onSelectDoc,
  selectedDocIds,
  onToggleDocInSession,
  onLoadSamples,
  setActiveTab,
  isCollapsed,
  setIsCollapsed
}) => {
  if (isCollapsed) {
    return (
      <aside style={{
        width: '52px',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 0',
        gap: '16px',
        zIndex: 30
      }}>
        <button
          onClick={() => setIsCollapsed(false)}
          className="btn-icon"
          title="Expand sidebar"
        >
          <ChevronRight size={18} />
        </button>

        <div style={{ width: '28px', height: '1px', backgroundColor: 'var(--border-subtle)' }} />

        <button
          onClick={() => setActiveTab('workspace')}
          className="btn-icon"
          title="Workspace"
        >
          <FileText size={18} color="var(--primary-light)" />
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className="btn-icon"
          title="Document Library"
        >
          <Layers size={18} />
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className="btn-icon"
          title="Research Sessions"
        >
          <Clock size={18} />
        </button>
      </aside>
    );
  }

  return (
    <aside style={{
      width: '280px',
      minWidth: '280px',
      maxWidth: '280px',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 60px)',
      overflowY: 'auto',
      zIndex: 30,
      userSelect: 'none'
    }}>
      {/* Sidebar Header & Collapse button */}
      <div style={{
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Research Context
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="btn-icon"
          style={{ padding: '4px' }}
          title="Collapse sidebar"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Section 1: Active In-Scope Documents */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-white)' }}>
            Active Documents ({selectedDocIds.length}/{documents.length})
          </span>
          <button
            onClick={() => setActiveTab('library')}
            style={{ fontSize: '11px', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: '3px' }}
            title="Manage all library documents"
          >
            All Docs <ChevronRight size={12} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {documents.map((doc) => {
            const isSelected = selectedDocIds.includes(doc.id);
            const isCurrentlyViewing = activeDocId === doc.id;

            return (
              <div
                key={doc.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 9px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isCurrentlyViewing ? 'rgba(99, 102, 241, 0.14)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isCurrentlyViewing ? 'var(--primary-border)' : 'var(--border-subtle)'}`,
                  transition: 'all var(--transition-fast)'
                }}
              >
                {/* Checkbox for active search scope */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleDocInSession(doc.id);
                  }}
                  title={isSelected ? 'Remove from Q&A search scope' : 'Include in Q&A search scope'}
                  style={{ display: 'flex', alignItems: 'center', color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }}
                >
                  {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                </button>

                {/* Document Title / Click to view in Reader */}
                <div
                  onClick={() => {
                    onSelectDoc(doc.id);
                    setActiveTab('workspace');
                  }}
                  style={{
                    flex: 1,
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                  title={`Click to read: ${doc.title}`}
                >
                  <div style={{
                    fontSize: '12px',
                    fontWeight: isCurrentlyViewing ? 600 : 400,
                    color: isCurrentlyViewing ? 'var(--lavender)' : 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {doc.title}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', gap: '6px' }}>
                    <span>{doc.fileType.toUpperCase()}</span>
                    <span>•</span>
                    <span>{doc.pagesCount} pages</span>
                  </div>
                </div>
              </div>
            );
          })}

          {documents.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '20px 10px',
              color: 'var(--text-muted)',
              fontSize: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-subtle)'
            }}>
              No documents uploaded yet.
              <button
                onClick={onLoadSamples}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '10px', width: '100%' }}
              >
                <RefreshCw size={12} />
                Load Sample Papers
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Research Sessions (History) */}
      <div style={{ flex: 1, padding: '14px 16px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-white)' }}>
            Research Sessions ({sessions.length})
          </span>
          <button
            onClick={() => setActiveTab('sessions')}
            style={{ fontSize: '11px', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: '3px' }}
          >
            History <ChevronRight size={12} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {sessions.map((sess) => {
            const isActive = activeSession?.id === sess.id;
            const msgCount = sess.messages.length;

            return (
              <div
                key={sess.id}
                onClick={() => {
                  onSelectSession(sess.id);
                  setActiveTab('workspace');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
                  border: `1px solid ${isActive ? 'var(--border-medium)' : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                className="session-row-item"
              >
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--text-white)' : 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {sess.title}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', gap: '6px' }}>
                    <span>{msgCount} message{msgCount === 1 ? '' : 's'}</span>
                    <span>•</span>
                    <span>{new Date(sess.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>

                {sessions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(sess.id);
                    }}
                    className="btn-icon"
                    style={{ padding: '3px', opacity: 0.6 }}
                    title="Delete session"
                  >
                    <Trash2 size={13} color="var(--text-muted)" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info: Local Storage & Reset */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Database size={12} /> Local IndexedDB
          </span>
          <span>{documents.reduce((acc, d) => acc + d.pagesCount, 0)} pages cached</span>
        </div>

        <button
          onClick={onLoadSamples}
          className="btn btn-ghost btn-sm"
          style={{ justifyContent: 'flex-start', padding: '4px 6px', fontSize: '11px', color: 'var(--primary-light)' }}
          title="Restore curated sample papers and initial test session"
        >
          <RefreshCw size={12} />
          Reload Curated Research Papers
        </button>
      </div>
    </aside>
  );
};
