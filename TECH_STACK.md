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
