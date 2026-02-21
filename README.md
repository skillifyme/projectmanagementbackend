# 🎓 AI Career Path Recommendation System – SkillifyMe

> An AI-powered career guidance platform that analyzes student grade sheets and recommends potential career paths using **Gemini API** and **MongoDB**.

---

## 📌 Overview

The **AI Career Path Recommendation System** (SkillifyMe) allows students to upload their academic grade sheets.  
The system extracts academic records, analyzes them using the **Gemini AI API**, and generates tailored **career/job recommendations**.  

It is a **full-stack application** built with:
- **Node.js + Express** (backend services)
- **Python (Flask/AI logic)** for integrating with **Gemini API**
- **MongoDB** for persistent storage
- **React (frontend)** for user interaction

---

## ✨ Features

- 📄 Upload grade sheets for analysis  
- 🤖 AI-powered career recommendations (via Gemini API)  
- 💾 MongoDB integration for storing grades and recommendations  
- 🌐 Full-stack workflow (Node.js + Python + React)  
- 🔒 Extensible and scalable backend design  

---

## 🏗️ Project Structure

```plaintext
trialbackend/
├── backend/                 # Node.js + Python backend
│   ├── index.js             # Node server entry
│   ├── app.py               # Python service (Gemini API integration)
│   └── ...                 
├── trialbacked-skillifyme/  # Frontend (React)
│   └── src/
├── package.json
└── README.md
```

---
## 🛠️ Prerequisites


Make sure you have installed:

Node.js
 (v16+ recommended)

Python
 (v3.9+)

MongoDB
 (local installation)
 
 ---
 
 ## 🚀 Setup & Run

1️⃣ Start MongoDB

Open CMD and run:

"C:\Program Files\MongoDB\Server\8.0\bin\mongod"


Open another CMD and run:

mongosh
use skillifyme

2️⃣ Start Backend (Node.js)
cd trialbackend/backend
nodemon index.js

3️⃣ Start Python Service (AI integration)
cd trialbackend/backend
python app.py

4️⃣ Start Frontend (React)
cd trialbackend/trialbacked-skillifyme
npm install   # first time only
npm run dev

5️⃣ Access the Application

Once all services are running, open:
👉 http://localhost:5173 (React frontend)
👉 Backend APIs will run on their respective ports (http://localhost:5000, http://localhost:8000, etc. based on config).

---

## ⚙️ Configuration


Update MongoDB connection string in backend if needed (mongodb://localhost:27017/skillifyme).

API Keys (for Gemini or external services) should be stored in a .env file:

GEMINI_API_KEY=your_api_key_here
MONGO_URI=mongodb://localhost:27017/skillifyme

---

## 📖 Example Workflow


User uploads grade sheet (CSV/PDF).

Backend parses the data → sends to Python AI service.

Gemini API analyzes the grades → returns career/job suggestions.

Results are stored in MongoDB.

Frontend displays recommendations.
