import React, { useState } from 'react';
import { 
  Settings, 
  X, 
  Cpu, 
  Key, 
  Server, 
  Database, 
  Trash2, 
  Check, 
  Download,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { AppSettings, ResearchSession, DocumentItem } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onResetData: () => void;
  sessions: ResearchSession[];
  documents: DocumentItem[];
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetData,
  sessions,
  documents
}) => {
  const [currentSettings, setCurrentSettings] = useState<AppSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(currentSettings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleExportAllJSON = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      version: '2.4',
      sessions,
      documents
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `researchflow_export_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 8, 16, 0.85)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 70,
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '560px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-light)'
            }}>
              <Settings size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', color: 'white' }}>Workspace Settings</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Configure RAG intelligence backend, citations, and storage
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon" style={{ padding: '4px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Section 1: AI Model Engine */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-white)', display: 'block', marginBottom: '8px' }}>
              RAG Synthesis Engine
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Option 1: Local */}
              <div
                onClick={() => setCurrentSettings({ ...currentSettings, aiMode: 'local-rag' })}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: currentSettings.aiMode === 'local-rag' ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                  border: `1px solid ${currentSettings.aiMode === 'local-rag' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <Cpu size={18} color={currentSettings.aiMode === 'local-rag' ? 'var(--primary-light)' : 'var(--text-muted)'} style={{ marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-white)' }}>
                    Local Evidence Engine (Default & Offline)
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    Fast, deterministic client-side lexical & BM25 vector ranker. Runs entirely in your browser without transmitting data to external APIs.
                  </div>
                </div>
              </div>

              {/* Option 2: Gemini */}
              <div
                onClick={() => setCurrentSettings({ ...currentSettings, aiMode: 'gemini-api' })}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: currentSettings.aiMode === 'gemini-api' ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                  border: `1px solid ${currentSettings.aiMode === 'gemini-api' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <Key size={18} color={currentSettings.aiMode === 'gemini-api' ? 'var(--primary-light)' : 'var(--text-muted)'} style={{ marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-white)' }}>
                    Google Gemini 1.5 Flash API
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    Connect your own Gemini API key for deep generative synthesis with grounded citation constraints.
                  </div>
                </div>
              </div>
            </div>

            {currentSettings.aiMode === 'gemini-api' && (
              <div style={{ marginTop: '10px' }}>
                <input
                  type="password"
                  placeholder="Enter Gemini API Key (AIzaSy...)"
                  value={currentSettings.geminiApiKey || ''}
                  onChange={(e) => setCurrentSettings({ ...currentSettings, geminiApiKey: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: 'white'
                  }}
                />
                <span style={{ fontSize: '10.5px', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                  Stored safely in your browser localStorage only. Never sent to any third-party intermediary.
                </span>
              </div>
            )}
          </div>

          {/* Section 2: UX Preferences */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-white)', display: 'block', marginBottom: '8px' }}>
              Interaction Preferences
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', color: 'var(--text-primary)' }}>
              <input
                type="checkbox"
                checked={currentSettings.autoScrollToCitation}
                onChange={(e) => setCurrentSettings({ ...currentSettings, autoScrollToCitation: e.target.checked })}
              />
              Auto-scroll and pulse reader when clicking citations in conversation
            </label>
          </div>

          {/* Section 3: Data Management */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-white)', display: 'block', marginBottom: '8px' }}>
              Data & Persistence
            </label>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleExportAllJSON}
                className="btn btn-secondary btn-sm"
              >
                <Download size={13} /> Export All Data (.json)
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset workspace to default curated research papers and clear custom sessions?')) {
                    onResetData();
                    onClose();
                  }
                }}
                className="btn btn-secondary btn-sm"
                style={{ color: '#F87171' }}
              >
                <Trash2 size={13} /> Reset to Sample Papers
              </button>
            </div>
          </div>

          {/* Footer Submit */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '8px'
          }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              {savedSuccess ? (
                <>
                  <Check size={14} color="#10B981" /> Saved!
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
