import React from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  Sparkles, 
  FileText, 
  Layers, 
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Sliders,
  Cpu
} from 'lucide-react';

export const CaseStudyModal: React.FC = () => {
  return (
    <div style={{
      flex: 1,
      height: 'calc(100vh - 60px)',
      overflowY: 'auto',
      backgroundColor: 'var(--bg-main)',
      padding: '40px 60px',
      maxWidth: '1000px',
      margin: '0 auto',
      color: 'var(--text-primary)',
      lineHeight: 1.7
    }}>
      {/* Header Banner */}
      <div style={{
        padding: '28px 32px',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--primary-border)',
        marginBottom: '40px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-primary">UX Architecture Case Study</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ResearchFlow Product Design Specification</span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-white)', marginBottom: '12px' }}>
          ResearchFlow — AI Research Workspace
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '780px' }}>
          A product design and engineering deep dive into building an evidence-grounded research interface that prioritizes source transparency, document context, and honest AI interaction over generic conversational chat.
        </p>
      </div>

      {/* Section 1: Product Vision */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', color: 'white', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '16px' }}>
          1. Product Vision & Core Principle
        </h2>
        <div style={{
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          borderLeft: '4px solid #6366F1',
          padding: '16px 20px',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          <strong style={{ color: 'var(--lavender)', fontSize: '15px', display: 'block', marginBottom: '4px' }}>
            Core Principle: "Make complex research feel clear, traceable, and effortless."
          </strong>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            ResearchFlow addresses the fundamental credibility crisis in modern AI interfaces: generative models frequently hallucinate or synthesize plausible-sounding claims without verifiable roots in literature. ResearchFlow repositions the document and its verifiable evidence at the focal center of the experience.
          </span>
        </div>
      </section>

      {/* Section 2: Target Users */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', color: 'white', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '16px' }}>
          2. Target Audience & Core User Needs
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: 'white', fontSize: '14px', marginBottom: '6px' }}>🎓 University Students</h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Reading peer-reviewed papers, preparing literature reviews, and verifying citations for thesis bibliography compliance.
            </p>
          </div>
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: 'white', fontSize: '14px', marginBottom: '6px' }}>🔬 Academic & Industry Researchers</h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Reviewing multi-page policy reports, comparing quantitative benchmark metrics, and inspecting experimental methodologies.
            </p>
          </div>
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: 'white', fontSize: '14px', marginBottom: '6px' }}>💼 Knowledge Analysts & Policy Workers</h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Analyzing lengthy regulatory filings and technical whitepapers where unsupported hallucinations carry critical compliance liabilities.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Visual Identity & Design System */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', color: 'white', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '16px' }}>
          3. Visual Identity & Design Tokens
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          The visual system utilizes an intentional, restrained dark palette engineered to minimize cognitive fatigue during long-form reading sessions while providing unambiguous contrast for evidence verification.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ backgroundColor: '#0A0F1E', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'white' }}>Deep Navy (#0A0F1E)</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Background Canvas Foundation</div>
          </div>
          <div style={{ backgroundColor: '#1E2440', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'white' }}>Slate Surfaces (#1E2440)</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cards & Panel Elevation</div>
          </div>
          <div style={{ backgroundColor: '#6366F1', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'white' }}>Indigo Accent (#6366F1)</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Primary Interactive Focal</div>
          </div>
          <div style={{ backgroundColor: '#12182B', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid #10B981' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#34D399' }}>Emerald (#10B981)</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Verified Evidence Badges</div>
          </div>
        </div>
      </section>

      {/* Section 4: Main Interaction Patterns */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', color: 'white', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '16px' }}>
          4. Key UX Architecture & Interaction Patterns
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '18px 20px', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: 'var(--lavender)', fontSize: '14px', marginBottom: '6px' }}>
              A. Split-Screen Evidence Coordination
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Desktop research takes place in a coordinated 55/45 split view. The document reader preserves full context on the left, while the analytical conversation flows on the right. Clicking any citation in the chat automatically navigates the reader to the exact page, scrolls the excerpt into view, and animates a pulsing focus frame.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-card)', padding: '18px 20px', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: 'var(--lavender)', fontSize: '14px', marginBottom: '6px' }}>
              B. Transparent Insufficient Evidence Handling
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              When a question cannot be answered from the active documents (e.g., asking about an unrelated topic or requesting claims not supported in the text), the system explicitly refuses to guess or fabricate citations. An amber "Honest Evidence Assessment" card is displayed, clarifying exactly why the index lacks sufficient support.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-card)', padding: '18px 20px', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: 'var(--lavender)', fontSize: '14px', marginBottom: '6px' }}>
              C. Dual Engine Architecture (Local & Transparent vs Gemini API)
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              The workspace ships with an autonomous client-side evidence engine that operates with zero API keys or external server dependencies. Users with API keys can connect Google Gemini or custom FastAPI backends via settings, with strict citation grounding applied to external outputs.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Usability Testing & Future Roadmap */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '20px', color: 'white', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '16px' }}>
          5. Usability Testing Protocol & Future Improvements
        </h2>
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <h4 style={{ color: 'white', fontSize: '14px', marginBottom: '8px' }}>Structured Evaluation Criteria:</h4>
          <ul style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><strong>Time-to-Verification (TTV):</strong> Seconds elapsed between reading an AI assertion and locating the backing paragraph in the reader.</li>
            <li><strong>Citation Trust Calibration:</strong> Likelihood of user double-checking findings via the one-click jump interaction.</li>
            <li><strong>Cross-Document Comparative Synthesis:</strong> Ability to synthesize findings from multiple heterogeneous documents simultaneously.</li>
            <li><strong>Roadmap Enhancements:</strong> Multi-column PDF layout preservation, OCR integration for scanned archival PDFs, and collaborative shared research workspaces.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
