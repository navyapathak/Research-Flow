import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Upload, 
  Settings, 
  Download, 
  PlusCircle, 
  Layers, 
  ShieldCheck,
  Check,
  Edit2
} from 'lucide-react';
import { ResearchSession, DocumentItem, AppSettings } from '../types';

interface NavbarProps {
  activeSession: ResearchSession | null;
  onUpdateSessionTitle: (title: string) => void;
  onNewSession: () => void;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  onExportSession: () => void;
  activeDocuments: DocumentItem[];
  settings: AppSettings;
  activeTab: 'workspace' | 'library' | 'sessions' | 'casestudy';
  setActiveTab: (tab: 'workspace' | 'library' | 'sessions' | 'casestudy') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSession,
  onUpdateSessionTitle,
  onNewSession,
  onOpenUpload,
  onOpenSettings,
  onExportSession,
  activeDocuments,
  settings,
  activeTab,
  setActiveTab
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(activeSession?.title || 'Research Workspace');

  React.useEffect(() => {
    if (activeSession) {
      setTitleInput(activeSession.title);
    }
  }, [activeSession?.id, activeSession?.title]);

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (titleInput.trim()) {
      onUpdateSessionTitle(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="navbar-container" style={{
      height: '60px',
      minHeight: '60px',
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      zIndex: 40
    }}>
      {/* Brand Logo & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button 
          onClick={() => setActiveTab('workspace')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
          title="ResearchFlow — Return to Workspace"
        >
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={18} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ 
              fontFamily: 'var(--font-heading)', 
              fontWeight: 700, 
              fontSize: '16px', 
              letterSpacing: '-0.02em',
              color: 'var(--text-white)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              ResearchFlow
              <span style={{ 
                fontSize: '10px', 
                backgroundColor: 'rgba(99, 102, 241, 0.2)', 
                color: 'var(--lavender)', 
                padding: '1px 6px', 
                borderRadius: '4px',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                fontWeight: 600
              }}>
                v2.4
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1 }}>
              Intelligent Evidence Workspace
            </div>
          </div>
        </button>

        {/* Vertical divider */}
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-subtle)' }} />

        {/* Active Session Title (Inline Editable) */}
        {activeSession && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isEditingTitle ? (
              <form onSubmit={handleTitleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onBlur={handleTitleSubmit}
                  autoFocus
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--primary)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '4px 10px',
                    fontSize: '13px',
                    color: 'white',
                    width: '260px'
                  }}
                />
                <button type="submit" className="btn-icon" style={{ padding: '4px' }}>
                  <Check size={14} color="#10B981" />
                </button>
              </form>
            ) : (
              <div 
                onClick={() => setIsEditingTitle(true)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background var(--transition-fast)'
                }}
                className="session-title-hover"
                title="Click to rename session"
              >
                <Layers size={14} color="var(--primary-light)" />
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: 500, 
                  color: 'var(--text-primary)',
                  maxWidth: '280px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {activeSession.title}
                </span>
                <Edit2 size={12} color="var(--text-muted)" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Center Nav tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--bg-main)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => setActiveTab('workspace')}
          style={{
            padding: '5px 14px',
            fontSize: '12px',
            fontWeight: 500,
            borderRadius: 'var(--radius-sm)',
            color: activeTab === 'workspace' ? 'white' : 'var(--text-secondary)',
            backgroundColor: activeTab === 'workspace' ? 'var(--primary)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all var(--transition-fast)'
          }}
        >
          <BookOpen size={14} />
          Workspace
        </button>

        <button
          onClick={() => setActiveTab('library')}
          style={{
            padding: '5px 14px',
            fontSize: '12px',
            fontWeight: 500,
            borderRadius: 'var(--radius-sm)',
            color: activeTab === 'library' ? 'white' : 'var(--text-secondary)',
            backgroundColor: activeTab === 'library' ? 'var(--primary)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all var(--transition-fast)'
          }}
        >
          <Layers size={14} />
          Library ({activeDocuments.length})
        </button>

        <button
          onClick={() => setActiveTab('casestudy')}
          style={{
            padding: '5px 14px',
            fontSize: '12px',
            fontWeight: 500,
            borderRadius: 'var(--radius-sm)',
            color: activeTab === 'casestudy' ? 'white' : 'var(--text-secondary)',
            backgroundColor: activeTab === 'casestudy' ? 'var(--primary)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all var(--transition-fast)'
          }}
        >
          <ShieldCheck size={14} />
          UX Case Study
        </button>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Transparent Engine Mode Pill */}
        <div 
          onClick={onOpenSettings}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: settings.aiMode === 'local-rag' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.12)',
            border: `1px solid ${settings.aiMode === 'local-rag' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 500,
            color: settings.aiMode === 'local-rag' ? '#34D399' : 'var(--lavender)'
          }}
          title="Click to configure AI Engine settings"
        >
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: settings.aiMode === 'local-rag' ? '#10B981' : '#818CF8',
            boxShadow: settings.aiMode === 'local-rag' ? '0 0 6px #10B981' : '0 0 6px #818CF8'
          }} />
          {settings.aiMode === 'local-rag' ? 'Local Evidence Engine (Offline)' : 'Gemini 1.5 Flash Connected'}
        </div>

        {/* New Session Button */}
        <button
          onClick={onNewSession}
          className="btn btn-secondary btn-sm"
          title="Start fresh research session"
        >
          <PlusCircle size={14} />
          New Session
        </button>

        {/* Upload Button */}
        <button
          onClick={onOpenUpload}
          className="btn btn-primary btn-sm"
          title="Upload PDF or Document"
        >
          <Upload size={14} />
          Upload
        </button>

        {/* Export Session */}
        {activeSession && (
          <button
            onClick={onExportSession}
            className="btn-icon"
            title="Export synthesis to Markdown"
          >
            <Download size={17} />
          </button>
        )}

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="btn-icon"
          title="Workspace Settings"
        >
          <Settings size={17} />
        </button>
      </div>
    </header>
  );
};
