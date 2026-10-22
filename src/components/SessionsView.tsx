import React from 'react';
import { 
  Clock, 
  MessageSquare, 
  FileText, 
  ArrowRight, 
  Trash2, 
  PlusCircle, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { ResearchSession, DocumentItem } from '../types';

interface SessionsViewProps {
  sessions: ResearchSession[];
  activeSession: ResearchSession | null;
  documents: DocumentItem[];
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onNewSession: () => void;
  onNavigateToWorkspace: () => void;
}

export const SessionsView: React.FC<SessionsViewProps> = ({
  sessions,
  activeSession,
  documents,
  onSelectSession,
  onDeleteSession,
  onNewSession,
  onNavigateToWorkspace
}) => {
  const handleResume = (id: string) => {
    onSelectSession(id);
    onNavigateToWorkspace();
  };

  return (
    <div style={{
      flex: 1,
      height: 'calc(100vh - 60px)',
      overflowY: 'auto',
      backgroundColor: 'var(--bg-main)',
      padding: '32px 40px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-white)', marginBottom: '4px' }}>
            Research History & Sessions
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Review past investigations, examine saved citations, and continue previous analytical threads.
          </p>
        </div>

        <button onClick={onNewSession} className="btn btn-primary">
          <PlusCircle size={15} />
          New Research Session
        </button>
      </div>

      {/* Sessions Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {sessions.map((session) => {
          const isActive = activeSession?.id === session.id;
          const userMessagesCount = session.messages.filter((m) => m.role === 'user').length;
          const totalCitationsCount = session.messages.reduce((acc, m) => acc + (m.citations?.length || 0), 0);

          const attachedDocs = documents.filter((d) => session.documentIds.includes(d.id));

          return (
            <div
              key={session.id}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${isActive ? 'var(--primary-border)' : 'var(--border-subtle)'}`,
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px',
                transition: 'all var(--transition-fast)'
              }}
              className="session-card-item"
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <h3
                    onClick={() => handleResume(session.id)}
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: 'var(--text-white)',
                      cursor: 'pointer'
                    }}
                  >
                    {session.title}
                  </h3>
                  {isActive && (
                    <span className="badge badge-primary" style={{ fontSize: '10px' }}>
                      Current Active
                    </span>
                  )}
                </div>

                {/* Subtitle / attached documents */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MessageSquare size={14} color="var(--primary-light)" />
                    {userMessagesCount} question{userMessagesCount === 1 ? '' : 's'} answered
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Sparkles size={14} color="#10B981" />
                    {totalCitationsCount} verified citations
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={14} color="var(--text-muted)" />
                    Updated {new Date(session.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Document tags */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Referenced Documents:
                  </span>
                  {attachedDocs.map((doc) => (
                    <span
                      key={doc.id}
                      style={{
                        fontSize: '11px',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        color: 'var(--lavender)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      {doc.title}
                    </span>
                  ))}
                  {attachedDocs.length === 0 && (
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                      No documents currently assigned
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => handleResume(session.id)}
                  className="btn btn-primary btn-sm"
                >
                  Resume Session <ArrowRight size={13} />
                </button>

                {sessions.length > 1 && (
                  <button
                    onClick={() => onDeleteSession(session.id)}
                    className="btn-icon"
                    style={{ padding: '6px' }}
                    title="Delete session"
                  >
                    <Trash2 size={15} color="var(--text-muted)" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
