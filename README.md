# Aprende 🇪🇸 | Neuro-Linguistic Spanish Acquisition Platform

> **Aprende** is an evidence-based, interactive web platform dedicated exclusively to learning Spanish. It integrates **3 research-backed non-audio/non-video learning techniques** across a structured **CEFR level progression system (A1 to C1)** with clean architectural separation.

---

## 🔬 The 3 Evidence-Based Learning Techniques

In strict accordance with empirical second-language acquisition research (excluding audio/video listening tasks):

| # | Technique | Scientific Foundation | In-App Engine |
|---|---|---|---|
| **1** | **Dual-Coding & Contextual Text Association** | **Paivio (1971)** Dual-Coding Theory & **Nation (2001)** Input Hypothesis. Visual mental imagery + textual context doubles grammatical inflection recall compared to text alone. | **Tab 1: "Codificación Visual"**<br/>High-contrast dynamic SVG vector scenes with missing target words. Reinforces grammatical gender (`-o`/`-a`) and verbal conjugations with instant morphosyntactic feedback. |
| **2** | **Spaced Repetition Cloze Testing (SR-Cloze)** | **Ebbinghaus (1885)** Forgetting Curve & **Hermann (2006)** Retrieval Practice. Mutilated sentences force active recall from long-term memory over passive recognition. | **Tab 2: "Cloze Espaciado"**<br/>Authentic contextual Spanish sentences with targeted blank spots, multi-tiered hints (Grammar cue, English root, Spanish synonym), and response-latency-driven spaced repetition scheduling. |
| **3** | **Sentence Deconstruction & Syntactic Rebuilding** | **Schmidt (1990)** Noticing Hypothesis & Syntactic Priming. Rearranging scrambled word tiles trains subconscious grammar intuition and canonical order. | **Tab 3: "Constructor Sintáctico"**<br/>Interactive word tile assembly bench with real-time validation of clitic pronoun placement (`No me lo digas`), adjective position, and syntactic role breakdown. |

---

## 📊 CEFR Level Progression (A1 to C1)

- **A1 (Breakthrough / Principiante):** Basic vocabulary, present tense, adjective gender/number agreement.
- **A2 (Waystage / Elemental):** Past tenses (*Pretérito Indefinido* vs. *Imperfecto*), verbal periphrases (*acabar de + inf*).
- **B1 (Threshold / Intermedio):** Subjunctive mood triggers (*insistir en que*, *tan pronto como*), double clitic mutation (*se lo*).
- **B2 (Vantage / Intermedio Alto):** Exceptive subjunctive connectors (*a menos que*), unfulfilled hypothetical conditionals (*de haberlo sabido... habría*).
- **C1 (Effective Operational Proficiency):** Intensive concessive structures (*por muy... que + subjuntivo*), archaic legal future subjunctive (*hubiere*), absolute participle inversions (*Concluidas las deliberaciones...*).

### Progression Mechanics
- **Mastery XP:** Earned across all 3 modes (+40 XP Visual, +50 XP Cloze, +60 XP Syntax).
- **Interactive Diagnostic Modal:** Detailed breakdown of Visual Score, Cloze Score, Syntax Score, and mastery percentages.
- **Streak & Level-Up Celebrations:** Confetti particle bursts and animated modal promotions on crossing CEFR thresholds.

---

## 🛠️ Tech Stack & Clean Architecture

```
Aprende/
├── frontend/                     # React 18 + Vite + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # Navbar, ProgressBar, DiagnosticModal, LevelUpModal, ResearchModal
│   │   │   ├── techniques/      # VisualDualCoding, SpacedClozeRecall, SyntacticConstructor, SvgIllustrations
│   │   ├── data/                # Local exercises fallback dataset
│   │   ├── services/            # REST API client with local offline fallback
│   │   ├── store/               # Zustand state store with persistence & confetti
│   │   └── types/               # TypeScript interfaces
│   ├── Dockerfile               # Multi-stage build with Nginx
│   └── nginx.conf               # SPA routing & API reverse proxy
│
├── backend/                      # Node.js + Express + TypeScript
│   ├── prisma/
│   │   └── schema.prisma        # MySQL schema (User, LevelProgress, Exercise, ClozeReview, Submission)
│   ├── src/
│   │   ├── cache/               # Redis abstraction with high-performance In-Memory fallback
│   │   ├── controllers/         # ExerciseController, ProgressController, UserController
│   │   ├── data/                # Comprehensive exercise repository for A1-C1
│   │   ├── repositories/        # Repository pattern interfaces & implementations
│   │   ├── routes/              # Express API router (/api/exercises, /api/progress/submit, /api/user/stats)
│   │   ├── services/            # ExerciseService, ProgressionService
│   │   └── server.ts            # Express server entry point
│   └── Dockerfile               # Production container definition
│
├── docker-compose.yml           # Multi-container orchestration (App, MySQL 8.0, Redis 7.0)
└── package.json                 # Monorepo task orchestration
```

---

## 🚀 Quick Start Guide

### 1. Run with Node.js Locally

```bash
# In first terminal (start backend REST API):
npm run dev:backend

# In second terminal (start React frontend):
npm run dev:frontend
```

Frontend runs on: **`http://localhost:5173`**  
Backend REST API runs on: **`http://localhost:5001/api`**  
Healthcheck: **`http://localhost:5001/api/health`**

### 2. Run with Docker Compose

To launch the entire stack including Frontend, Backend, MySQL 8.0, and Redis 7:

```bash
docker-compose up --build
```

- Web UI: **`http://localhost`**
- REST API: **`http://localhost:5001/api`**

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health & Redis connection readiness status |
| `GET` | `/api/exercises?level={level}&type={type}` | Fetch exercises filtered by CEFR level (`A1`–`C1`) and technique |
| `GET` | `/api/exercises/:id` | Fetch specific exercise details |
| `POST` | `/api/progress/submit` | Submit exercise answer, calculate XP, and compute SRS review interval |
| `GET` | `/api/user/stats` | Retrieve user CEFR ranking and 3-technique diagnostic stats |
