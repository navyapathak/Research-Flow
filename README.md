# ResearchFlow — AI Research Workspace

An intelligent, distinctive, responsive research workspace that combines a high-fidelity document reader, transparent source citations, and verified evidence-grounded AI synthesis.

> **Product Principle:** *Make complex research feel clear, traceable, and effortless.*

---

## ✨ Features

- **Split-Screen Desktop Workspace:** Coordinated 54/46 split-view between the Document Reader on the left and Research Conversation on the right, with a smooth draggable panel divider.
- **Traceable Source Citations:** Every assertion in answers links directly to verifiable pages. Clicking any citation automatically scrolls the reader to that exact page and highlights the backing excerpt with an animated pulse.
- **Dual AI Mode (Local Offline RAG vs Connected AI):**
  - **Local Evidence Engine (Default & Offline):** Runs fully client-side using deterministic BM25-style relevance scoring and page indexing. Zero API key required, zero external network dependency, 100% transparent.
  - **Google Gemini 1.5 Flash:** Optional integration via Workspace Settings for generative synthesis with strict citation grounding.
- **Document Processing Pipeline:** Multi-stage client-side ingestion for PDF, Markdown (.md), and Plain Text (.txt) with real progression: `Uploading` → `Extracting text` → `Processing paragraphs` → `Indexing sections` → `Ready`.
- **Honest Negative State Protocol:** When active documents lack sufficient text to support an inquiry, the system explicitly refuses to hallucinate, displaying an honest evidence assessment alert.
- **Document Library:** Comprehensive management with format filters (PDF, TXT, MD), keyword search, status badges, and chunk inspection.
- **Session History & Markdown Export:** Persistent storage via IndexedDB & localStorage, multi-session management, and one-click export of research syntheses to formatted Markdown (`.md`) or JSON.
- **Responsive Architecture:** Fully responsive layout with mobile adaptive pane switcher (`Document Reader` vs `Research Chat`) preserving reader position and citation state.
- **In-App UX Case Study:** Complete built-in case study viewer with design tokens, accessibility protocols, and information architecture specs.

---

## 🎨 Visual Identity

- **Deep Navy:** `#0A0F1E` (Canvas background)
- **Slate Surfaces:** `#12182B`, `#1E2440`, `#283258` (Layered panels & elevation)
- **Brand Indigo:** `#6366F1` (Interactive focal points, buttons, primary accents)
- **Lavender:** `#E0E7FF` (Readable text accents, badges)
- **Verified Green:** `#10B981` (High-confidence citation matches)
- **Typography:** Space Grotesk (Headings & Badges), Inter (Reading surface & UI), JetBrains Mono (Citations & Code)

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v20.0.0` or higher (`v22.4.0` verified)
- npm `v10.0.0` or higher

### Installation

```bash
# Clone or navigate to the repository
cd "reseach flow"

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Type check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## ☁️ Deployment Guide

### Frontend Deployment on Vercel

The frontend is fully configured for zero-configuration deployment on **Vercel**:

1. Push your repository to GitHub or GitLab.
2. Go to the [Vercel Dashboard](https://vercel.com/new).
3. Import the repository.
4. Framework Preset will auto-detect as **Vite**.
5. Build settings will auto-populate:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. Click **Deploy**.

The bundled `vercel.json` ensures all client-side routes rewrite to `/index.html` and static assets receive long-term immutable caching headers.

---

## 🧠 Backend Strategy & Architecture Assessment

### Serverless vs Container Backend Comparison

| Dimension | Vercel Serverless Functions | Dedicated Container Host (Render / Railway / Fly.io) |
|---|---|---|
| **Max Execution Duration** | 10s (Hobby) / 60s (Pro) | Indefinite / Streaming HTTP/WebSockets |
| **Memory Limit** | 1024 MB (default) | 2GB - 16GB+ |
| **Model Weight Storage** | Ephemeral, no local disk | Persistent SSD / Container Volumes |
| **Vector DB Support** | External cloud DB required (Pinecone) | Local embedded Chroma / Qdrant supported |
| **Suitability for Heavy RAG** | ⚠️ Limited for multi-page PDF OCR | ✅ Recommended for Python/FastAPI RAG |

### Recommended Backend Configuration (if connecting a Python/FastAPI service)

If deploying a companion Python backend (e.g. LangChain / LlamaIndex / FastAPI):
1. **Deploy Python backend on Render or Railway:**
   - Dockerfile or `requirements.txt` (`fastapi`, `uvicorn`, `pydantic`, `pypdf`).
2. **CORS Configuration in FastAPI:**
   ```python
   from fastapi import FastAPI
   from fastapi.middleware.cors import CORSMiddleware

   app = FastAPI()

   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://your-researchflow.vercel.app", "http://localhost:5173"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```
3. **Environment Variables:**
   - In frontend Vercel project settings:
     ```env
     VITE_BACKEND_API_URL=https://your-fastapi-service.onrender.com/api/v1
     ```

---

## 📄 UX Documentation

For the complete product architecture, user personas, interaction models, and usability testing framework, see [`CASE-STUDY.md`](./CASE-STUDY.md) or click the **UX Case Study** tab in the top navigation bar inside the running application.
