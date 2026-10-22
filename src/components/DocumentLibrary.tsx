import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Upload, 
  Trash2, 
  FileText, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  RefreshCw,
  Eye,
  Calendar,
  Layers,
  CheckSquare,
  Square,
  Download
} from 'lucide-react';
import { DocumentItem, FileFormat } from '../types';

interface DocumentLibraryProps {
  documents: DocumentItem[];
  activeDocId: string | null;
  selectedDocIds: string[];
  onSelectDoc: (id: string) => void;
  onToggleDocInSession: (id: string) => void;
  onDeleteDoc: (id: string) => void;
  onOpenUpload: () => void;
  onLoadSamples: () => void;
  onNavigateToWorkspace: () => void;
}

export const DocumentLibrary: React.FC<DocumentLibraryProps> = ({
  documents,
  activeDocId,
  selectedDocIds,
  onSelectDoc,
  onToggleDocInSession,
  onDeleteDoc,
  onOpenUpload,
  onLoadSamples,
  onNavigateToWorkspace
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [formatFilter, setFormatFilter] = useState<'all' | FileFormat>('all');
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (doc.tags && doc.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase())));

    const matchesFormat = formatFilter === 'all' || doc.fileType === formatFilter;

    return matchesSearch && matchesFormat;
  });

  const getStatusBadge = (status: DocumentItem['status']) => {
    switch (status) {
      case 'ready':
        return <span className="badge badge-success"><CheckCircle size={10} /> Ready</span>;
      case 'processing':
      case 'indexing':
      case 'extracting':
        return <span className="badge badge-warning"><Clock size={10} /> {status}</span>;
      case 'failed':
      case 'unsupported':
      case 'empty':
        return <span className="badge badge-danger"><AlertCircle size={10} /> {status}</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  const handleOpenDocInWorkspace = (id: string) => {
    onSelectDoc(id);
    if (!selectedDocIds.includes(id)) {
      onToggleDocInSession(id);
    }
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
      {/* Library Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-white)', marginBottom: '4px' }}>
            Document Library
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Manage research papers, extracted text chunks, and active evidence indexes ({documents.length} total files).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onLoadSamples}
            className="btn btn-secondary"
            title="Reload default academic dataset"
          >
            <RefreshCw size={14} />
            Reload Sample Papers
          </button>
          <button
            onClick={onOpenUpload}
            className="btn btn-primary"
          >
            <Upload size={14} />
            Upload Document
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        backgroundColor: 'var(--bg-surface)',
        padding: '12px 18px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flex: 1,
          maxWidth: '380px'
        }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by title, filename, or tag..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '13px',
              outline: 'none',
              width: '100%'
            }}
          />
        </div>

        {/* Format Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '4px' }}>
            Format:
          </span>
          {(['all', 'pdf', 'txt', 'md'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormatFilter(fmt)}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                textTransform: 'uppercase',
                backgroundColor: formatFilter === fmt ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
                color: formatFilter === fmt ? 'white' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                transition: 'all var(--transition-fast)'
              }}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      {filteredDocs.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border-medium)',
          padding: '60px 20px',
          textAlign: 'center',
          color: 'var(--text-muted)'
        }}>
          <FileText size={40} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
          <h3 style={{ fontSize: '16px', color: 'var(--text-white)', marginBottom: '8px' }}>
            No Matching Documents Found
          </h3>
          <p style={{ fontSize: '13px', marginBottom: '20px' }}>
            Try adjusting your search criteria or upload a new research document.
          </p>
          <button onClick={onOpenUpload} className="btn btn-primary btn-sm">
            <Upload size={14} /> Upload First File
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '18px'
        }}>
          {filteredDocs.map((doc) => {
            const isSelectedInSession = selectedDocIds.includes(doc.id);
            const isCurrentlyViewing = activeDocId === doc.id;

            return (
              <div
                key={doc.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${isCurrentlyViewing ? 'var(--primary-border)' : 'var(--border-subtle)'}`,
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  transition: 'all var(--transition-fast)',
                  boxShadow: 'var(--shadow-sm)'
                }}
                className="document-card-item"
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => onToggleDocInSession(doc.id)}
                      title={isSelectedInSession ? 'Remove from Q&A search scope' : 'Include in Q&A search scope'}
                      style={{ color: isSelectedInSession ? 'var(--primary)' : 'var(--text-muted)' }}
                    >
                      {isSelectedInSession ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>
                    <span className="badge badge-primary" style={{ fontSize: '10px' }}>
                      {doc.fileType.toUpperCase()}
                    </span>
                  </div>
                  {getStatusBadge(doc.status)}
                </div>

                {/* Title & summary */}
                <div style={{ flex: 1 }}>
                  <h3
                    onClick={() => handleOpenDocInWorkspace(doc.id)}
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--text-white)',
                      marginBottom: '6px',
                      cursor: 'pointer',
                      lineHeight: 1.35
                    }}
                    title="Click to open in reader"
                  >
                    {doc.title}
                  </h3>
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.45,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {doc.summary || doc.pages[0]?.textContent.substring(0, 150) + '...'}
                  </p>
                </div>

                {/* Metadata & Tags */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  paddingTop: '12px'
                }}>
                  <span>{doc.pagesCount} pages</span>
                  <span>•</span>
                  <span>{(doc.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                  <span>•</span>
                  <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  marginTop: 'auto'
                }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="btn btn-secondary btn-sm"
                      title="Inspect extracted text chunks"
                    >
                      <Eye size={13} /> Inspect
                    </button>
                    <button
                      onClick={() => handleOpenDocInWorkspace(doc.id)}
                      className="btn btn-primary btn-sm"
                      title="Open in split-screen workspace"
                    >
                      <ExternalLink size={13} /> Open
                    </button>
                  </div>

                  <button
                    onClick={() => onDeleteDoc(doc.id)}
                    className="btn-icon"
                    style={{ padding: '6px' }}
                    title="Delete document"
                  >
                    <Trash2 size={14} color="var(--text-muted)" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Document Inspection Modal */}
      {previewDoc && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 60,
          padding: '24px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '700px',
            maxHeight: '80vh',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-xl)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: '15px', color: 'white' }}>{previewDoc.title}</h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Extracted {previewDoc.pagesCount} pages • {previewDoc.fileName}
                </span>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="btn-icon">
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {previewDoc.pages.map((p) => (
                <div key={p.pageNumber} style={{
                  padding: '14px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--lavender)', marginBottom: '8px' }}>
                    PAGE {p.pageNumber}
                  </div>
                  <p style={{ fontSize: '12px', lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                    {p.textContent.substring(0, 600)}...
                  </p>
                </div>
              ))}
            </div>

            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setPreviewDoc(null)} className="btn btn-secondary btn-sm">
                Close
              </button>
              <button
                onClick={() => {
                  handleOpenDocInWorkspace(previewDoc.id);
                  setPreviewDoc(null);
                }}
                className="btn btn-primary btn-sm"
              >
                Open in Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
