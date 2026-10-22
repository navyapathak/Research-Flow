import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  BookOpen, 
  Check, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  AlertTriangle, 
  ExternalLink, 
  Layers, 
  ArrowRight,
  RefreshCw,
  HelpCircle,
  FileText
} from 'lucide-react';
import { ChatMessage, Citation, DocumentItem } from '../types';

interface ResearchChatProps {
  messages: ChatMessage[];
  onSendMessage: (query: string) => void;
  isLoading: boolean;
  activeDocuments: DocumentItem[];
  onSelectCitation: (citation: Citation) => void;
  onSelectDocument: (docId: string) => void;
}

export const ResearchChat: React.FC<ResearchChatProps> = ({
  messages,
  onSendMessage,
  isLoading,
  activeDocuments,
  onSelectCitation,
  onSelectDocument
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<{ [id: string]: 'up' | 'down' }>({});
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText.trim());
      setInputText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(140, e.target.scrollHeight)}px`;
  };

  const handleCopyMessage = (msg: ChatMessage) => {
    let text = msg.content + '\n\n';
    if (msg.structuredAnswer) {
      text += `Executive Summary:\n${msg.structuredAnswer.summary}\n\n`;
      if (msg.structuredAnswer.keyFindings?.length) {
        text += 'Key Findings:\n' + msg.structuredAnswer.keyFindings.map((k) => `- ${k}`).join('\n') + '\n\n';
      }
    }
    if (msg.citations?.length) {
      text += 'Citations:\n' + msg.citations.map((c, i) => `[${i + 1}] ${c.documentTitle}, p. ${c.pageNumber}: "${c.excerpt}"`).join('\n');
    }

    navigator.clipboard.writeText(text);
    setCopiedMsgId(msg.id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handlePromptChipClick = (prompt: string) => {
    if (!isLoading) {
      onSendMessage(prompt);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--bg-surface)',
      borderLeft: '1px solid var(--border-subtle)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Chat Header / Active Context Scope */}
      <div style={{
        height: '52px',
        minHeight: '52px',
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="var(--primary-light)" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-white)' }}>
            Research Conversation
          </span>
          <span className="badge badge-primary" style={{ fontSize: '10px' }}>
            {activeDocuments.length} doc{activeDocuments.length === 1 ? '' : 's'} in scope
          </span>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {activeDocuments.reduce((acc, d) => acc + d.pagesCount, 0)} pages indexed
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {messages.length === 0 && (
          <div style={{
            margin: 'auto',
            textAlign: 'center',
            maxWidth: '380px',
            color: 'var(--text-muted)',
            padding: '20px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: 'var(--primary-light)'
            }}>
              <BookOpen size={24} />
            </div>
            <h3 style={{ fontSize: '16px', color: 'var(--text-white)', marginBottom: '8px' }}>
              Begin Research Inquiry
            </h3>
            <p style={{ fontSize: '13px', lineHeight: 1.5, marginBottom: '20px' }}>
              Ask questions to extract evidence-grounded insights. Every assertion will be backed by verifiable citations directly from your active papers.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Suggested inquiries:
              </span>
              <button
                onClick={() => handlePromptChipClick('Summarize the primary objectives and key quantitative findings')}
                className="btn btn-secondary btn-sm"
                style={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                Summarize primary objectives and quantitative findings
              </button>
              <button
                onClick={() => handlePromptChipClick('What are the critical limitations and bottlenecks discussed?')}
                className="btn btn-secondary btn-sm"
                style={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                What are the critical limitations and bottlenecks?
              </button>
              <button
                onClick={() => handlePromptChipClick('Explain the core methodology and experimental architecture')}
                className="btn btn-secondary btn-sm"
                style={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                Explain the core methodology and architecture
              </button>
            </div>
          </div>
        )}

        {messages.map((msg) => {
          if (msg.role === 'user') {
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: 'flex-end',
                  maxWidth: '85%',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '16px 16px 4px 16px',
                  fontSize: '13.5px',
                  lineHeight: 1.5,
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                }}
              >
                {msg.content}
              </div>
            );
          }

          // Assistant Message
          const isSufficient = msg.structuredAnswer?.hasSufficientEvidence ?? true;

          return (
            <div
              key={msg.id}
              style={{
                alignSelf: 'flex-start',
                width: '100%',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              {/* Header Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: isSufficient ? 'rgba(99, 102, 241, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSufficient ? 'var(--primary-light)' : '#FBBF24'
                  }}>
                    {isSufficient ? <Sparkles size={14} /> : <AlertTriangle size={14} />}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-white)' }}>
                    {isSufficient ? 'Evidence-Grounded Synthesis' : 'Honest Evidence Assessment'}
                  </span>
                  {msg.citations && msg.citations.length > 0 && (
                    <span className="badge badge-success" style={{ fontSize: '10px' }}>
                      {msg.citations.length} Verified Sources
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopyMessage(msg)}
                    className="btn-icon"
                    style={{ padding: '4px' }}
                    title="Copy full synthesis to clipboard"
                  >
                    {copiedMsgId === msg.id ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                  </button>

                  {/* Feedback Thumbs */}
                  <button
                    onClick={() => setFeedbackGiven((prev) => ({ ...prev, [msg.id]: 'up' }))}
                    className="btn-icon"
                    style={{
                      padding: '4px',
                      color: feedbackGiven[msg.id] === 'up' ? '#10B981' : 'var(--text-muted)'
                    }}
                    title="Helpful & accurate evidence"
                  >
                    <ThumbsUp size={13} />
                  </button>
                  <button
                    onClick={() => setFeedbackGiven((prev) => ({ ...prev, [msg.id]: 'down' }))}
                    className="btn-icon"
                    style={{
                      padding: '4px',
                      color: feedbackGiven[msg.id] === 'down' ? '#EF4444' : 'var(--text-muted)'
                    }}
                    title="Unverified or incomplete"
                  >
                    <ThumbsDown size={13} />
                  </button>
                </div>
              </div>

              {/* Insufficient Evidence Warning Banner */}
              {!isSufficient && (
                <div style={{
                  padding: '12px 14px',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12.5px',
                  color: '#FDE68A',
                  lineHeight: 1.5
                }}>
                  <strong style={{ display: 'block', marginBottom: '4px' }}>
                    Zero High-Confidence Evidence Found
                  </strong>
                  {msg.structuredAnswer?.insufficientEvidenceReason ||
                    'The active documents do not contain verifiable data to answer this inquiry without speculation.'}
                </div>
              )}

              {/* Main Executive Explanation */}
              <div style={{
                fontSize: '13.5px',
                lineHeight: 1.65,
                color: 'var(--text-primary)',
                fontWeight: 400
              }}>
                {msg.content}
              </div>

              {/* Structured Key Findings */}
              {msg.structuredAnswer?.keyFindings && msg.structuredAnswer.keyFindings.length > 0 && (
                <div style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 16px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    color: 'var(--lavender)',
                    marginBottom: '10px',
                    textTransform: 'uppercase'
                  }}>
                    Key Grounded Findings:
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {msg.structuredAnswer.keyFindings.map((finding, fIdx) => (
                      <li key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                        <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>•</span>
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Citations & Excerpt Inspector Cards */}
              {msg.citations && msg.citations.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>Supporting Source Excerpts ({msg.citations.length})</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      Click to jump directly to page & paragraph
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {msg.citations.map((citation, cIdx) => (
                      <div
                        key={citation.id}
                        onClick={() => {
                          onSelectDocument(citation.documentId);
                          onSelectCitation(citation);
                        }}
                        style={{
                          padding: '10px 14px',
                          backgroundColor: 'rgba(99, 102, 241, 0.08)',
                          border: '1px solid rgba(99, 102, 241, 0.25)',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                        className="citation-card-hover"
                        title="Click to view and highlight in Document Reader"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--lavender)' }}>
                            [{cIdx + 1}] {citation.documentTitle} • Page {citation.pageNumber}
                          </span>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            color: '#34D399',
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            padding: '1px 6px',
                            borderRadius: '4px'
                          }}>
                            {Math.round(citation.confidence * 100)}% Match
                          </span>
                        </div>

                        <p style={{
                          fontSize: '12px',
                          lineHeight: 1.5,
                          color: 'var(--text-secondary)',
                          fontStyle: 'italic',
                          margin: 0
                        }}>
                          "{citation.excerpt}"
                        </p>

                        <div style={{
                          marginTop: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '10.5px',
                          color: 'var(--primary-light)',
                          fontWeight: 500
                        }}>
                          Jump to Source in Reader <ArrowRight size={11} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Follow-up Inquiries */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div style={{ marginTop: '4px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>
                    Suggested follow-up inquiries:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {msg.suggestedFollowUps.map((followUp, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePromptChipClick(followUp)}
                        className="btn btn-secondary btn-sm"
                        style={{
                          fontSize: '11.5px',
                          padding: '4px 10px',
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          borderColor: 'var(--border-subtle)',
                          color: 'var(--lavender)'
                        }}
                      >
                        {followUp}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--primary-border)',
            borderRadius: 'var(--radius-lg)',
            width: 'fit-content'
          }}>
            <div style={{
              width: '18px',
              height: '18px',
              border: '2px solid rgba(99, 102, 241, 0.2)',
              borderTopColor: '#6366F1',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <span style={{ fontSize: '13px', color: 'var(--lavender)', fontWeight: 500 }}>
              Searching active document indexes & verifying citations...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Question Composer & Toolbar */}
      <div style={{
        padding: '14px 18px',
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        {/* Quick prompt pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
          <button
            onClick={() => handlePromptChipClick('Summarize the primary methodology')}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '11px', padding: '3px 8px', border: '1px solid var(--border-subtle)' }}
          >
            Summarize methodology
          </button>
          <button
            onClick={() => handlePromptChipClick('What are the key limitations discussed?')}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '11px', padding: '3px 8px', border: '1px solid var(--border-subtle)' }}
          >
            What are the limitations?
          </button>
          <button
            onClick={() => handlePromptChipClick('Extract numerical results & benchmark scores')}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '11px', padding: '3px 8px', border: '1px solid var(--border-subtle)' }}
          >
            Numerical results
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <div style={{
            flex: 1,
            position: 'relative',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-medium)',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about the active research papers..."
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '13px',
                lineHeight: 1.45,
                resize: 'none',
                outline: 'none',
                maxHeight: '140px',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="btn btn-primary"
            style={{
              height: '40px',
              padding: '0 16px',
              opacity: !inputText.trim() || isLoading ? 0.4 : 1,
              cursor: !inputText.trim() || isLoading ? 'not-allowed' : 'pointer'
            }}
            title="Send inquiry (Enter)"
          >
            <Send size={15} />
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10.5px', color: 'var(--text-dim)' }}>
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Traceable & citation-backed</span>
        </div>
      </div>
    </div>
  );
};
