# 🚀 Prompt Generator - AI Product Description Generator

A modern, full-stack, AI-powered e-commerce copy generation platform featuring **ChatGPT-style Server-Sent Events (SSE) streaming responses**. Built with **Next.js 14 (App Router)**, **Node.js/Express**, **Prisma ORM**, **MySQL**, and a containerized **Ollama Local LLM (`llama3.2:1b`)**.

Designed with a clean, minimal **Dark Grey Chatbot Interface**.

---

## 📌 Project Overview

The **Prompt Generator** automates e-commerce copywriting by converting product specifications (Name, Color, Material, Key Features, Tone) into structured, persuasive product descriptions complete with headlines, feature highlights, and call-to-actions (CTAs).

### Key Features:
- **ChatGPT-Style SSE Live Streaming:** Responses stream live chunk-by-chunk directly into the browser with a live typewriter effect and cursor (`▌`).
- **Clean Minimalist Chatbot Interface:** Clean conversation feed with user prompt bubbles and assistant response containers.
- **Dedicated History Route (`/history`):** Saved descriptions are persisted to a **MySQL database** via Prisma ORM and can be searched, copied, deleted, or reloaded into the active chat session.
- **Fault-Tolerant AI Engine:** Dual-engine architecture guarantees zero downtime. Connects to Dockerized Ollama or uses a tokenized micro-delay fallback stream when Ollama is offline.

---

## 🛠️ Technology Stack & Architecture

### **1. Frontend (User Interface)**
* **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Client & Server Components)
* **Language:** TypeScript
* **Styling:** Tailwind CSS with Clean Dark Theme Tokens (`zinc-950` / `zinc-900`)
* **Streaming API:** Browser `EventSource` SSE Client

### **2. Backend (API Layer)**
* **Runtime:** Node.js + Express
* **Language:** TypeScript
* **ORM & Database Client:** [Prisma ORM](https://www.prisma.io/)
* **Streaming API:** Server-Sent Events (`Content-Type: text/event-stream`)
* **HTTP Client:** Axios (for Ollama LLM container integration)

### **3. Database Layer**
* **Engine:** MySQL 8.0 (Containerized or local instance)
* **Schema Management:** Prisma Migrations & Declarative Schema

### **4. AI Model & Inference Engine**
* **Local LLM Container:** [Ollama](https://ollama.com/) serving open-weight models (`llama3.2:1b` / `qwen2.5:0.5b`)
* **Fallback Stream Engine:** Tokenized micro-delay stream fallback providing live typewriter responses.

---

## 🏗️ System Architecture & Data Flow

```
┌─────────────────────────┐          ┌─────────────────────────┐
│ Next.js 14 (Frontend)   │ ───────> │ Node.js Express API     │
│ http://localhost:3000   │ <======= │ http://localhost:5000   │
└─────────────────────────┘   (SSE)  └────────────┬────────────┘
                                                  │
                      ┌───────────────────────────┴───────────────────────────┐
                      ▼                                                       ▼
        ┌───────────────────────────┐                           ┌───────────────────────────┐
        │ Ollama LLM Container      │                           │ MySQL 8.0 Database        │
        │ (llama3.2:1b Inference)   │                           │ (Prisma Persistence)      │
        │ http://localhost:11434    │                           │ Port 3306                 │
        └───────────────────────────┘                           └───────────────────────────┘
```

### **SSE Streaming Data Flow:**
1. **User Action:** User inputs product attributes into the floating prompt console.
2. **Session Initialization:** Frontend posts parameters to `POST /api/generate/session` and receives a unique `sessionId`.
3. **SSE Connection:** Frontend establishes an `EventSource` connection to `GET /api/generate/stream/:sessionId`.
4. **Live Streaming:** Express streams response chunks line-by-line (`data: {"text":"chunk"}\n\n`).
5. **UI Typewriter Effect:** The frontend appends text live to the assistant message bubble in real time.
6. **Completion & DB Persistence:** Upon completion (`done: true`), backend persists the record to MySQL (`prisma.productDescription.create`), closes the SSE connection cleanly, and refreshes the history list.

---

## 🗄️ Database Schema

Defined in `backend/prisma/schema.prisma`:

```prisma
model ProductDescription {
  id                   String   @id @default(uuid())
  productName          String
  color                String
  material             String
  features             String   @db.Text
  tone                 String   @default("Professional")
  generatedDescription String   @db.Text
  modelUsed            String   @default("Docker AI Model")
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}
```

---

## 🚦 Getting Started & Local Development

### **Prerequisites**
* Node.js (v18+)
* Docker & Docker Desktop (for containerized deployment)
* MySQL (if running locally outside Docker)

### **Method A: Quick Start via Docker Compose (Recommended)**

```bash
# 1. Clone the repository
git clone https://github.com/divyanshumittal65/AI_Product_Description_Generator.git
cd AI_Product_Description_Generator

# 2. Build and launch all services via Docker Compose
docker-compose up --build
```
* **Frontend:** `http://localhost:3000`
* **Backend API:** `http://localhost:5000`
* **Ollama Service:** `http://localhost:11434`

---

### **Method B: Running Locally (Manual Setup)**

#### **1. Backend Setup**
```bash
cd backend
npm install

# Create .env file in backend/
# DATABASE_URL="mysql://root:password@localhost:3306/product_desc"
# PORT=5000
# MODEL_URL="http://localhost:11434"
# MODEL_NAME="llama3.2:1b"

# Run Prisma Database Migrations
npx prisma db push

# Start Backend Server
npm run dev
```

#### **2. Frontend Setup**
```bash
cd frontend
npm install

# Start Next.js Development Server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License

Distributed under the MIT License. Built for performance, aesthetics, and reliability.