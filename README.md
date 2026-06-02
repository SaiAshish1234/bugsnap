# BugSnap — AI-Powered Error Analyzer

A developer tool that instantly explains cryptic error messages in plain English, identifies the root cause, and provides a working code fix — powered by Google Gemini AI.

![BugSnap](https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square)
![Gemini](https://img.shields.io/badge/Gemini-AI-4285f4?style=flat-square&logo=google)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)

> *"Stop Googling error messages. Just BugSnap it."*

---

## The Problem

Every developer knows the pain — you hit a cryptic error, spend 45 minutes on Stack Overflow, and still can't figure out what went wrong. BugSnap fixes that in seconds.

---

## Features

- **AI Error Explanation** — Paste any error and get a plain English breakdown instantly
- **Root Cause Analysis** — Understand *why* the error happened, not just what it says
- **Code Fix Suggestions** — Get an actual working code snippet to fix the bug
- **Auto Language Detection** — Automatically detects JavaScript, Python, Java, React, Node.js and more
- **Severity Rating** — AI rates the severity: Low, Medium, High, or Critical
- **Error History** — All analyzed errors saved locally so you can reference them later
- **Copy Fix Button** — One click to copy the suggested code fix
- **Terminal Aesthetic** — Hacker-style UI with scan lines, monospace fonts, and green-on-black design

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| AI | Google Gemini API (gemini-2.5-flash) |
| Styling | CSS-in-JS |
| Storage | localStorage (error history) |
| Fonts | JetBrains Mono + Inter |
| Routing | React Router v6 |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Google AI Studio API key (free at [aistudio.google.com](https://aistudio.google.com))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SaiAshish1234/bugsnap.git
cd bugsnap
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## How to Use

1. **Paste your error** — Copy any error message or stack trace into the input box
2. **Select language** — Choose your language or let AI auto-detect it
3. **Click RUN ANALYSIS** — Gemini AI analyzes the error in seconds
4. **Read the output** — Get a clear explanation, root cause, and code fix
5. **Copy the fix** — One click to copy the suggested solution
6. **Check history** — All past errors saved in the History tab

---

## Supported Languages

- JavaScript / TypeScript
- React / Next.js
- Python
- Java
- Node.js
- Ruby
- And any other language (via Auto detection)

---

## Project Structure

```
src/
├── components/
│   └── layout/
│       ├── Layout.jsx      # App shell with terminal bar + status bar
│       └── Sidebar.jsx     # Navigation + recent bugs
├── pages/
│   ├── Analyze.jsx         # Main error analyzer page
│   └── History.jsx         # Error history page
├── lib/
│   └── ai.js               # Gemini API integration + language detection
└── App.jsx                 # Routes
```

---

## Roadmap

- [x] AI error explanation with Gemini API
- [x] Auto language detection
- [x] Severity rating
- [x] Code fix suggestions with copy button
- [x] Error history with localStorage
- [x] Terminal hacker aesthetic UI
- [ ] User accounts with Supabase (save history across devices)
- [ ] Share a bug fix via link
- [ ] VS Code extension
- [ ] Support for more languages (Go, Rust, C++)

---

## Author

**G Sai Ashish**
- GitHub: [@SaiAshish1234](https://github.com/SaiAshish1234)
- LinkedIn: [sai-ashish](https://www.linkedin.com/in/sai-ashish-a496a3273)
- Email: saiashish236@gmail.com

---

## License

MIT License — feel free to use this project as inspiration for your own work.
