# 🚀 AI Product Description Generator

A modern, full-stack, AI-powered e-commerce copy generation platform. Built with **Next.js 14 (App Router)**, **Node.js/Express**, **Prisma ORM**, **MySQL**, and a containerized **Ollama Local LLM (`llama3.2:1b`)**.

Designed with a sleek, high-contrast **Tactile Dark Zinc & Amber** design system.

---

## 📌 Project Overview

The **AI Product Description Generator** automates e-commerce copywriting by converting raw product specifications (Name, Color, Material, Key Features, Tone) into structured, persuasive product descriptions complete with headlines, feature highlights, and call-to-actions (CTAs).

All generated records are automatically saved to a persistent **MySQL database** and can be retrieved, searched, copied, or reloaded anytime through an interactive **History Engine**.

---

## 🛠️ Technology Stack & Architecture

### **1. Frontend (User Interface)**
* **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Client & Server Components)
* **Language:** TypeScript
* **Styling:** Tailwind CSS with Custom Tactile Dark Neubrutalist CSS Tokens
* **Icons:** Lucide React

### **2. Backend (API Layer)**
* **Runtime:** Node.js + Express
* **Language:** TypeScript
* **ORM & Database Client:** [Prisma ORM](https://www.prisma.io/)
* **API Architecture:** RESTful Endpoints (`POST /api/generate`, `GET /api/descriptions`, `DELETE /api/descriptions/:id`)
* **HTTP Client:** Axios (for connecting to Ollama LLM container)

### **3. Database Layer**
* **Engine:** MySQL 8.0 (Dockerized containerized instance)
* **Schema Management:** Prisma Migrations & Declarative Schema Definitions

### **4. AI Model & Inference Engine**
* **Local LLM Container:** [Ollama](https://ollama.com/) serving open-weight models (`llama3.2:1b` / `qwen2.5:0.5b`)
* **Fallback Resilience:** Custom AI Rule Engine backup ensuring 100% uptime even if the LLM container is initializing or downloading model weights.

### **5. Infrastructure & Containerization**
* **Orchestration:** Docker Compose multi-service architecture (`model`, `mysqldb`, `backend`, `frontend`)

---

## 🏗️ System Architecture & Data Flow

```
┌─────────────────────────┐          ┌─────────────────────────┐
│ Next.js 14 (Frontend)   │ ───────> │ Node.js Express API     │
│ http://localhost:3000   │ <─────── │ http://localhost:5000   │
└─────────────────────────┘          └────────────┬────────────┘
                                                  │
                      ┌───────────────────────────┴───────────────────────────┐
                      ▼                                                       ▼
        ┌───────────────────────────┐                           ┌───────────────────────────┐
        │ Ollama LLM Container      │                           │ MySQL 8.0 Database        │
        │ (llama3.2:1b Inference)   │                           │ (Prisma Persistence)      │
        │ http://localhost:11434    │                           │ Port 3306                 │
        └───────────────────────────┘                           └───────────────────────────┘
```

### **Detailed Data Flow:**
1. **User Action:** User inputs product attributes (Product Name, Color, Material, Features, Tone) on the frontend form.
2. **API Request:** Frontend issues a `POST` request to `/api/generate` with JSON payload.
3. **AI Inference:** The Express backend constructs a structured prompt and calls Ollama's `/api/generate` REST endpoint over HTTP.
4. **Fallback Handling:** If Ollama is unreachable or timing out, the backend gracefully delegates generation to the internal AI Rule Engine.
5. **Persistence:** The generated description is stored in the MySQL database via Prisma ORM (`prisma.productDescription.create`).
6. **UI Hydration:** The response is returned to the frontend, updating the UI card in real time and appending the entry to the History Sidebar.

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

## ✨ Key Features

1. **Multi-Tone Copywriting Engine:**
   * **Professional:** Polished, trustworthy e-commerce copy.
   * **Luxury / Premium:** Sophisticated, elegant phrasing highlighting exclusivity.
   * **Casual / Playful:** Friendly, relatable, and approachable tone.
   * **Creative:** Engaging, narrative-driven copy.
   * **SEO Optimized:** Keyword-focused, scannable bullet points for search ranking.

2. **Interactive Quick Presets:**
   * Pre-configured product demo chips (*Men's Cotton T-Shirt*, *Slim Leather Wallet*, *Noise-Canceling Headphones*) for 1-click testing.

3. **Persistent History Engine & Real-Time Filter:**
   * Automatically retains generated descriptions across browser sessions.
   * Real-time search filter searching across product name, material, color, and tone.
   * 1-click **Copy to Clipboard** and **Load Copy** features.

4. **Fault-Tolerant AI Engine:**
   * Dual-engine architecture guarantees zero downtime.

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

## 🎓 Technical Interview Q&A (Study Guide)

When presenting or discussing this project, reference these technical points:

### **Q1: Why use Prisma ORM over raw SQL queries?**
> *"Prisma provides full TypeScript type-safety from database query to API response, automatically generating types based on the schema. It simplifies migrations (`npx prisma db push`), prevents SQL injection attacks, and provides a clean declarative syntax."*

### **Q2: How does the AI inference pipeline work?**
> *"The backend uses Axios to post structured prompts to Ollama's REST API endpoint (`http://localhost:11434/api/generate`). To ensure zero downtime, I implemented a fallback mechanism: if the local LLM container is busy or offline, an algorithmic rule engine generates fallback copy so the user experience is never broken."*

### **Q3: How is state managed between the frontend and database?**
> *"The Next.js frontend maintains reactive React state (`useState`, `useEffect`). Upon submission, it sends a payload to the backend, receives the persisted database object, and updates the local state immutably so the generated copy card and history list update immediately without full page reloads."*

---

## 📜 License

Distributed under the MIT License. Built for performance, aesthetics, and reliability.