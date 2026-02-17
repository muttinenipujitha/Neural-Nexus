
# NEURAL NEXUS 🧠⚡

A modern, private knowledge AI interface built with Next.js. Neural Nexus allows you to upload local text files, create a secure knowledge base, and interact with your data using Retrieval-Augmented Generation (RAG).

Designed with a clean, high-contrast "Sci-Fi" aesthetic, featuring separated grids and efficient data visualization.



## ✨ Features

- **🔒 Private Knowledge Base**: All data processing happens client-side and via API calls. No external database required for storage.
- **⚡ Real-time RAG**: Upload `.txt` files and instantly query them using advanced AI logic (Groq / Llama 3).
- **🎨 Clean UI/UX**: Professional, high-contrast interface with separated grids, backdrop blurring, and responsive design.
- **💾 Local Persistence**: Chat history and uploaded documents are saved automatically using browser `localStorage`.
- **🔍 Source Verification**: Every AI response includes the source document and the specific text snippet used to generate the answer.
- **📊 System Health Monitor**: Integrated status page to check API connectivity and system health.

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Provider**: Groq (Llama 3.1-8b-Instant)
- **Storage**: Browser LocalStorage (Client-side)
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed on your machine.
- A [Groq API Key](https://console.groq.com/). (It's free and fast).

### Installation

1.  **Clone or download the project.**

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of your project and add your Groq API key:
    ```env
    GROQ_API_KEY=gsk_your_actual_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000).

## 📂 Project Structure

```
/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts      # Handles RAG logic & LLM generation
│   │   ├── health/
│   │   │   └── route.ts      # Checks API status
│   │   └── upload/
│   │       └── route.ts      # Handles file parsing & chunking
│   ├── status/
│   │   └── page.tsx          # System Status Page
│   ├── layout.tsx
│   └── page.tsx              # Main UI (Home)
├── public/
├── .env.local                # API Keys (Not in git)
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 📖 How to Use

1.  **Inject Data:**
    *   Click the dashed **"Inject Data"** box in the left sidebar.
    *   Select a `.txt` file from your computer (e.g., a project brief, documentation, or notes).
    *   The file will appear under **"Active Nodes"**.

2.  **Initialize Query:**
    *   Type your question in the central command bar (e.g., *"Summarize the key points of the uploaded document."*).
    *   Press **Enter** or click the **Send** arrow.

3.  **Review Results:**
    *   The AI response will appear in the center chat area.
    *   Check the **Right Sidebar (Verification)** to see which document and specific text snippet ("Context Window") was used to generate the answer.

4.  **Manage History:**
    *   Your conversation history is saved automatically. You can clear it by clearing your browser's Local Storage.

## 🔧 API Routes

- **POST `/api/upload`**: Accepts a `FormData` file, splits it into ~1000 character chunks, and returns a JSON object with the chunks.
- **POST `/api/chat`**: Accepts a `question` and a list of `documents`. It uses an LLM to select the best chunk (Retrieval) and then generates an answer (Generation).
- **GET `/api/health`**: Pings the Groq API to ensure the connection is active.

## 🤝 Contributing

This is a personal project template. Feel free to fork, modify, and use it for your own RAG applications.

## 📝 License

MIT License - feel free to use this code however you like.
