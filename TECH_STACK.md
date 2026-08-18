# Tech Stack Explanation

This project is an AI Product Description Generator.

It uses a full-stack setup:

## Frontend

The frontend is built with Next.js 14, React, TypeScript, Tailwind CSS, and Lucide React icons.

This part handles the user interface where the user enters product details like product name, color, material, features, and tone.

## Backend

The backend is built with Node.js, Express.js, and TypeScript.

It receives the product details from the frontend, sends them to the AI model, gets the generated description, and returns the result back to the frontend.

## Database

The project uses MySQL 8.0 as the database.

Generated product descriptions are saved in the database so they can be shown later in the history section.

## ORM

Prisma is used as the ORM.

It helps connect the backend with the MySQL database and makes database operations easier using TypeScript.

## AI Model

The AI part uses Ollama with a local language model like `llama3.2:1b`.

Ollama runs the AI model locally and generates the product description based on the input given by the user.

## API Communication

The project uses REST APIs for communication between frontend and backend.

Axios is used in the backend to communicate with the Ollama AI service.

## Docker

Docker and Docker Compose are used to run the frontend, backend, MySQL database, and Ollama model together as separate services.

## Overall

In simple words, this project uses Next.js for the frontend, Node.js and Express for the backend, MySQL for storing data, Prisma for database handling, Ollama for AI text generation, and Docker for running everything together.

## Project Folder Structure & File Descriptions

Below is the directory structure of the repository (excluding `node_modules`, build artifacts, lockfiles, and media files) with a one-line explanation of what each file does:

```
.
├── docker-compose.yml            # Multi-container Docker configuration for frontend, backend, MySQL, and Ollama services.
├── .gitignore                    # Specifies untracked files and directories for Git to ignore.
├── README.md                     # Comprehensive project setup instructions, feature overview, and API guide.
├── TECH_STACK.md                 # Technical stack documentation and repository file structure context.
├── explaination.md               # Detailed breakdown of system workflows, architecture diagrams, and design decisions.
├── backend/                      # Node.js + Express backend service directory.
│   ├── .env                      # Environment variables storing database URL, server port, and external service configurations.
│   ├── Dockerfile                # Docker container definition for building and serving the Express backend app.
│   ├── package.json              # Node.js manifest specifying backend dependencies, metadata, and npm scripts.
│   ├── tsconfig.json             # TypeScript compiler settings for the backend application.
│   ├── prisma/
│   │   └── schema.prisma         # Prisma ORM schema mapping the MySQL database models and client settings.
│   └── src/
│       ├── server.ts             # Server entry point configuring Express middleware, CORS, and HTTP port listening.
│       ├── routes/
│       │   └── productRoutes.ts  # Express router defining API endpoints for description generation, history retrieval, and CRUD operations.
│       ├── services/
│       │   └── aiService.ts      # Business logic handling Ollama AI API requests, prompt construction, and Prisma DB storage.
│       └── validators/
│           └── productValidator.ts # Input validation utility ensuring required fields exist before processing API requests.
└── frontend/                     # Next.js 14 frontend application directory.
    ├── Dockerfile                # Docker container configuration for building and hosting the Next.js frontend app.
    ├── next-env.d.ts             # Auto-generated TypeScript type definitions for Next.js features.
    ├── next.config.js            # Configuration settings for Next.js framework environment and behavior.
    ├── package.json              # Manifest listing frontend dependencies, UI libraries, and Next.js scripts.
    ├── postcss.config.js         # Configuration file for PostCSS processing Tailwind CSS styling directives.
    ├── tailwind.config.js        # Theme customization, color definitions, and plugin settings for Tailwind CSS.
    ├── tsconfig.json             # TypeScript options and module path alias mapping (@/*) for the frontend app.
    └── src/
        ├── app/
        │   ├── globals.css       # Global stylesheet incorporating Tailwind CSS utilities and base styling rules.
        │   ├── layout.tsx        # Root HTML layout wrapper configuring global page font, header, and metadata.
        │   ├── page.tsx          # Main interactive dashboard page integrating input forms, AI generation, and chat history.
        │   └── history/
        │       └── page.tsx      # Dedicated page rendering saved product description history records from the database.
        └── components/
            ├── ChatFeed.tsx      # Component displaying full conversational interaction stream between user and AI assistant.
            ├── ChatInput.tsx     # Component hosting generation prompt triggers, action buttons, and modal dialog launcher.
            ├── DescriptionCard.tsx # Card UI component displaying generated description text with copy, edit, and export actions.
            ├── Header.tsx        # Top header banner showcasing application title, logo badge, and quick info tags.
            ├── HistorySidebar.tsx # Collapsible drawer UI rendering recent generation history items for fast selection.
            ├── Navbar.tsx        # Top navigation bar containing route links between Home and History pages.
            └── ProductForm.tsx   # Input form modal capturing product details (name, features, material, color, and tone).
```
