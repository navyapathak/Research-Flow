import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Search, 
  X, 
  BookOpen, 
  Layers, 
  FileText, 
  Quote, 
  ExternalLink,
  Sparkles,
  Info
} from 'lucide-react';
import { DocumentItem, HighlightTarget } from '../types';

interface DocumentReaderProps {
  document: DocumentItem | null;
  highlightTarget: HighlightTarget | null;
  onClearHighlight: () => void;
  onAskAboutExcerpt?: (excerpt: string) => void;
}

export const DocumentReader: React.FC<DocumentReaderProps> = ({
  document,
  highlightTarget,
  onClearHighlight,
  onAskAboutExcerpt
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'paginated' | 'continuous'>('paginated');
  const [showMetadata, setShowMetadata] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>('');

  const excerptRef = useRef<HTMLDivElement | null>(null);
  const readerContainerRef = useRef<HTMLDivElement | null>(null);

  // Sync page when highlightTarget arrives
  useEffect(() => {
    if (highlightTarget && document && highlightTarget.documentId === document.id) {
      if (highlightTarget.pageNumber && highlightTarget.pageNumber !== currentPage) {
        setCurrentPage(highlightTarget.pageNumber);
      }
      
      // Auto-scroll to highlight
      setTimeout(() => {
        if (excerptRef.current) {
          excerptRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  }, [highlightTarget, document?.id]);

  // Reset to page 1 on document change
  useEffect(() => {
    if (!highlightTarget) {
      setCurrentPage(1);
    }
  }, [document?.id]);

  if (!document) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-muted)',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <FileText size={28} />
        </div>
        <h3 style={{ fontSize: '16px', color: 'var(--text-white)', marginBottom: '8px' }}>
          No Document Selected
        </h3>
        <p style={{ maxWidth: '340px', fontSize: '13px' }}>
          Select a research paper from the sidebar or upload a document to read and inspect supporting evidence.
        </p>
      </div>
    );
  }

  const activePageData = document.pages.find((p) => p.pageNumber === currentPage) || document.pages[0];

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(180, Math.max(70, prev + delta)));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const handleMouseUp = () => {
    const sel = window.getSelection()?.toString().trim();
    if (sel && sel.length > 5) {
      setSelectedText(sel);
    } else {
      setSelectedText('');
    }
  };

  // Helper to highlight matching keywords in text
  const renderHighlightedContent = (text: string) => {
    // Check if this page contains the active citation target
    const isTargetPage = highlightTarget && highlightTarget.documentId === document.id && highlightTarget.pageNumber === currentPage;
    const targetExcerpt = isTargetPage ? highlightTarget.excerptText : null;

    if (!text) return null;

    // Split text into paragraphs
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

    return paragraphs.map((para, pIdx) => {
      // Check if this paragraph contains the citation target excerpt
      const isTargetParagraph = targetExcerpt && (
        para.toLowerCase().includes(targetExcerpt.toLowerCase().substring(0, 40)) ||
        targetExcerpt.toLowerCase().includes(para.toLowerCase().substring(0, 40))
      );

      // Search term highlighting
      let renderedPara: React.ReactNode = para;
      if (searchQuery.trim().length > 1) {
        const regex = new RegExp(`(${searchQuery.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
        const parts = para.split(regex);
        renderedPara = parts.map((part, i) =>
          regex.test(part) ? (
            <mark
              key={i}
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.4)',
                color: '#FEF08A',
                borderRadius: '2px',
                padding: '0 2px'
              }}
            >
              {part}
            </mark>
          ) : (
            part
          )
        );
      }

      if (isTargetParagraph) {
        return (
          <div
            key={pIdx}
            ref={excerptRef}
            className="citation-highlight-pulse"
            style={{
              margin: '18px 0',
              padding: '14px 18px',
              backgroundColor: 'rgba(99, 102, 241, 0.16)',
              borderLeft: '4px solid #6366F1',
              borderRadius: 'var(--radius-sm)',
              position: 'relative'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--lavender)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={13} color="#818CF8" />
                VERIFIED SOURCE CITATION EXCERPT
              </span>
              <button
                onClick={onClearHighlight}
                style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}
                title="Dismiss highlight"
              >
                <X size={12} /> Clear
              </button>
            </div>
            <p style={{
              fontSize: `${14 * (zoomLevel / 100)}px`,
              lineHeight: 1.7,
              color: 'var(--text-white)',
              fontWeight: 450
            }}>
              {renderedPara}
            </p>
          </div>
        );
      }

      return (
        <p
          key={pIdx}
          style={{
            marginBottom: '16px',
            fontSize: `${14 * (zoomLevel / 100)}px`,
            lineHeight: 1.75,
            color: 'var(--text-primary)',
            letterSpacing: '0.01em'
          }}
        >
          {renderedPara}
        </p>
      );
    });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--bg-main)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Reader Top Toolbar */}
      <div style={{
        height: '52px',
        minHeight: '52px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 20
      }}>
        {/* Document Title & Type */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <span className="badge badge-primary" style={{ fontSize: '10px' }}>
            {document.fileType.toUpperCase()}
          </span>
          <span style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-white)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '260px'
          }}>
            {document.title}
          </span>
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className="btn-icon"
            style={{ padding: '3px' }}
            title="Document metadata & authors"
          >
            <Info size={14} color={showMetadata ? 'var(--primary-light)' : 'var(--text-muted)'} />
          </button>
        </div>

        {/* Page Navigation & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {viewMode === 'paginated' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'var(--bg-main)',
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="btn-icon"
                style={{ padding: '3px', opacity: currentPage <= 1 ? 0.3 : 1 }}
                title="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', padding: '0 4px' }}>
                Page {currentPage} of {document.pagesCount}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(document.pagesCount, p + 1))}
                disabled={currentPage >= document.pagesCount}
                className="btn-icon"
                style={{ padding: '3px', opacity: currentPage >= document.pagesCount ? 0.3 : 1 }}
                title="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Zoom controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button
              onClick={() => handleZoom(-10)}
              className="btn-icon"
              style={{ padding: '5px' }}
              title="Zoom out"
            >
              <ZoomOut size={15} />
            </button>
            <span 
              onClick={handleResetZoom}
              style={{ fontSize: '11px', color: 'var(--text-muted)', cursor: 'pointer', minWidth: '32px', textAlign: 'center' }}
              title="Click to reset 100%"
            >
              {zoomLevel}%
            </span>
            <button
              onClick={() => handleZoom(10)}
              className="btn-icon"
              style={{ padding: '5px' }}
              title="Zoom in"
            >
              <ZoomIn size={15} />
            </button>
          </div>

          {/* Search Toggle */}
          <button
            onClick={() => setIsSearching(!isSearching)}
            className="btn-icon"
            style={{ padding: '5px', color: isSearching ? 'var(--primary-light)' : 'var(--text-secondary)' }}
            title="Search in document"
          >
            <Search size={15} />
          </button>
        </div>
      </div>

      {/* In-Document Search Bar */}
      {isSearching && (
        <div style={{
          padding: '8px 16px',
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search keywords in document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '12px',
              color: 'white',
              outline: 'none'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="btn-icon"
              style={{ padding: '2px' }}
            >
              <X size={13} />
            </button>
          )}
          <button
            onClick={() => setIsSearching(false)}
            style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}
          >
            Close
          </button>
        </div>
      )}

      {/* Metadata Drawer Overlay */}
      {showMetadata && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: 'var(--bg-elevated)',
          borderBottom: '1px solid var(--border-medium)',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-white)' }}>Document Details</span>
            <button onClick={() => setShowMetadata(false)} className="btn-icon" style={{ padding: '2px' }}>
              <X size={13} />
            </button>
          </div>
          {document.authors && (
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Authors:</strong> {document.authors}
            </div>
          )}
          {document.journalOrSource && (
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Source:</strong> {document.journalOrSource} ({document.publicationDate})
            </div>
          )}
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>File Size:</strong> {(document.fileSize / (1024 * 1024)).toFixed(2)} MB • {document.pagesCount} pages
          </div>
          {document.summary && (
            <div style={{ marginTop: '4px', fontSize: '11px', color: 'var(--lavender)' }}>
              {document.summary}
            </div>
          )}
        </div>
      )}

      {/* Reading Canvas Surface */}
      <div
        ref={readerContainerRef}
        onMouseUp={handleMouseUp}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '30px 48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Floating Ask About Selection Tooltip */}
        {selectedText && onAskAboutExcerpt && (
          <div style={{
            position: 'sticky',
            top: '10px',
            zIndex: 30,
            marginBottom: '16px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--primary-border)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 12px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <Quote size={13} color="var(--primary-light)" />
            <span style={{ fontSize: '11px', color: 'var(--lavender)' }}>
              "{selectedText.substring(0, 35)}..."
            </span>
            <button
              onClick={() => {
                onAskAboutExcerpt(selectedText);
                setSelectedText('');
              }}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '11px', padding: '3px 8px' }}
            >
              Ask about this excerpt
            </button>
          </div>
        )}

        {/* Paper Canvas */}
        <div style={{
          width: '100%',
          maxWidth: '780px',
          backgroundColor: '#0F1424',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '40px 48px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
          minHeight: '700px'
        }}>
          {/* Page Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            paddingBottom: '12px',
            marginBottom: '28px',
            fontSize: '11px',
            color: 'var(--text-muted)'
          }}>
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {document.title}
            </span>
            <span>Page {currentPage}</span>
          </div>

          {/* Page Body Content */}
          <div style={{ color: 'var(--text-primary)' }}>
            {renderHighlightedContent(activePageData?.textContent || '')}
          </div>

          {/* Page Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '40px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            fontSize: '11px',
            color: 'var(--text-dim)'
          }}>
            — {currentPage} —
          </div>
        </div>
      </div>
    </div>
  );
};
