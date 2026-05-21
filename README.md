# 🧠 Zaydoun.AI - Admin Dashboard

Welcome to the frontend dashboard for **Zaydoun.AI**, a Voice-Activated RAG (Retrieval-Augmented Generation) system. This interface allows administrators to manage users, upload knowledge bases (PDFs), monitor chunk processing, and interact with the AI via voice.

## 🚀 Tech Stack

This project leverages a modern React ecosystem optimized for speed, animations, and internationalization:

* **Framework:** [Next.js](https://nextjs.org/) (App Router) with React 19
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & Sass
* **State & Data Fetching:** [Axios](https://axios-http.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Validation:** [Zod](https://zod.dev/)
* **Notifications:** [React Toastify](https://fkhadra.github.io/react-toastify/) & [SweetAlert2](https://sweetalert2.github.io/)
* **i18n:** [next-intl](https://next-intl-docs.vercel.app/) for multi-language support (English, French, Arabic/Darija)
* **Rich Text:** `react-quill-new`

## 📂 Core Features Planned

1. **Secure Authentication:** JWT-based login bridging to the Express backend.
2. **Library Management:** Upload PDF books (`multer` endpoint) and trigger the OpenAI `pdf-parse` processing pipeline.
3. **Knowledge Base Viewer:** Inspect vectors, chunks, and metadata extracted from uploaded documents.
4. **Voice Interface:** "Walkie-Talkie" style interaction using the device microphone to communicate with the Zaydoun AI orchestrator (Whisper STT -> pgvector RAG -> GPT-4o-mini -> TTS).

## 🛠️ Getting Started

First, install the dependencies:

```bash
npm install
```

Set up your local environment variables:
Create a .env.local file and point it to your local Express API:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run the development server:


```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result. Ayoub EDAHLOULI :)
