import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { FileProcessor } from '../services/fileProcessor';
import { DocumentItem } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentUploaded: (doc: DocumentItem) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentUploaded
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<'idle' | 'uploading' | 'extracting' | 'processing' | 'indexing' | 'ready' | 'failed'>('idle');
  const [progressPercent, setProgressPercent] = useState(0);
  const [stageMessage, setStageMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedDoc, setUploadedDoc] = useState<DocumentItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage('');
    setCurrentStage('uploading');
    setProgressPercent(15);
    setStageMessage('Initiating file upload...');

    try {
      const doc = await FileProcessor.processUploadedFile(file, (stage, progress, message) => {
        setCurrentStage(stage);
        setProgressPercent(progress);
        setStageMessage(message);
      });

      setUploadedDoc(doc);
      setCurrentStage('ready');
      setIsProcessing(false);
      onDocumentUploaded(doc);
    } catch (err: any) {
      console.error('File processing error:', err);
      setCurrentStage('failed');
      setErrorMessage(err.message || 'An error occurred while extracting text from the document.');
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCurrentStage('idle');
    setIsProcessing(false);
    setProgressPercent(0);
    setStageMessage('');
    setErrorMessage('');
    setUploadedDoc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
        maxWidth: '540px',
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
              <Upload size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', color: 'white' }}>Upload Research Document</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Index PDF or text documents with real page extraction
              </p>
            </div>
          </div>

          {!isProcessing && (
            <button onClick={onClose} className="btn-icon" style={{ padding: '4px' }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {currentStage === 'idle' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md,.markdown"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border-medium)'}`,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isDragging ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                  padding: '40px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(99, 102, 241, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  color: 'var(--primary-light)'
                }}>
                  <Upload size={24} />
                </div>

                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-white)', marginBottom: '6px' }}>
                  Click to choose file or drag and drop here
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Supported formats: PDF, Markdown (.md), Plain Text (.txt)
                </div>

                <span className="btn btn-secondary btn-sm" style={{ pointerEvents: 'none' }}>
                  Browse Local Files
                </span>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center', fontSize: '11px', color: 'var(--text-dim)' }}>
                <span>• Client-side privacy</span>
                <span>• Max recommended size: 25MB</span>
                <span>• Verifiable text parsing</span>
              </div>
            </div>
          )}

          {/* Processing Stages State */}
          {isProcessing && (
            <div style={{ padding: '20px 0', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px auto',
                color: 'var(--primary-light)'
              }}>
                <Loader2 size={26} className="spin-animation" />
              </div>

              <h4 style={{ fontSize: '15px', color: 'white', marginBottom: '6px' }}>
                {stageMessage}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Current stage: <strong style={{ color: 'var(--lavender)', textTransform: 'capitalize' }}>{currentStage}</strong>
              </p>

              {/* Progress bar */}
              <div style={{
                width: '100%',
                height: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '999px',
                overflow: 'hidden',
                marginBottom: '10px'
              }}>
                <div style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  backgroundColor: 'var(--primary)',
                  borderRadius: '999px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {progressPercent}% Complete
              </span>
            </div>
          )}

          {/* Ready State */}
          {currentStage === 'ready' && uploadedDoc && (
            <div style={{ padding: '16px 0', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: '#10B981'
              }}>
                <CheckCircle size={28} />
              </div>

              <h4 style={{ fontSize: '16px', color: 'white', marginBottom: '6px' }}>
                Document Ingestion Complete!
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Successfully indexed <strong style={{ color: 'var(--lavender)' }}>{uploadedDoc.pagesCount} page(s)</strong> from "{uploadedDoc.fileName}".
              </p>

              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '20px'
              }}>
                <div><strong>Format:</strong> {uploadedDoc.fileType.toUpperCase()}</div>
                <div><strong>Pages:</strong> {uploadedDoc.pagesCount}</div>
                <div><strong>Status:</strong> Ready for evidence-grounded queries</div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={handleReset} className="btn btn-secondary btn-sm">
                  Upload Another File
                </button>
                <button onClick={onClose} className="btn btn-primary btn-sm">
                  Open in Workspace <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* Error State */}
          {currentStage === 'failed' && (
            <div style={{ padding: '16px 0', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: '#EF4444'
              }}>
                <AlertCircle size={28} />
              </div>

              <h4 style={{ fontSize: '15px', color: 'white', marginBottom: '8px' }}>
                Upload Failed
              </h4>
              <p style={{ fontSize: '12.5px', color: '#F87171', marginBottom: '20px', lineHeight: 1.5 }}>
                {errorMessage}
              </p>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={onClose} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button onClick={handleReset} className="btn btn-primary btn-sm">
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
