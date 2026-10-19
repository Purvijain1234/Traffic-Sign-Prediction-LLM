# Traffic Sign Saarthi AI 🚦🇮🇳
### Multi-Model Indian Traffic Sign Classification & Statutory LLM Explainer

**Traffic Sign Saarthi AI** is an applied computer vision and road-safety engineering platform designed specifically for Indian roadway conditions. It evaluates traffic sign imagery using our highest-performing deep residual network (**ResNet18**, 87.58% test accuracy across 85 Indian standard classes) and pairs predictions with statutory legal context grounded strictly in the **Indian Roads Congress (IRC:67-2022)** standards and the **Motor Vehicles (Amendment) Act 2019**.

---

## ✨ Features
- **Deep Learning Recognition**: Evaluated on 85 Indian traffic-sign classes using a fine-tuned ResNet18 architecture yielding 87.58% top-1 accuracy.
- **Inference Studio**: Supports both user image uploads and live browser camera capture with real-time prediction distribution.
- **Statutory AI Assistant & LLM**: Answers driver queries on mandatory actions, safety rules, and official penalties under Sections 119 & 184 of the Indian Motor Vehicles Act.
  - Powered by **Google Gemini** with Grounded Retrieval-Augmented Generation (RAG).
  - Built-in fallback to deterministic statutory engine if no API key is provided.
- **Modern Responsive UI**: Built with React, TypeScript, Vite, and Tailwind CSS.

---

## 🏗️ Architecture

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS | High-performance responsive UI with dual light/dark themes |
| **Backend API** | FastAPI, Uvicorn, Python 3.10+ | Asynchronous REST endpoints for prediction and statutory Q&A |
| **Vision Model** | TensorFlow / Keras 3 (ResNet18) | 87.58% accuracy across 85 categories |
| **LLM Provider** | Google Gemini (`gemini-1.5-flash`) | Context-grounded conversational road safety advice |
| **Standards** | IRC:67-2022 & MVA 1988/2019 | Code of practice for road signs and enforcement penalties |

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- Git & Git LFS

### 2. Clone the Repository
```bash
git clone https://github.com/Purvijain1234/Traffic-Sign-Prediction-LLM.git
cd Traffic-Sign-Prediction-LLM
git lfs pull
```

### 3. Backend Setup
```bash
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Set your Gemini API Key
export GEMINI_API_KEY="your-gemini-api-key"   # On Windows: set GEMINI_API_KEY=your-gemini-api-key

# Run FastAPI backend
uvicorn backend.app:app --host 127.0.0.1 --port 8001 --reload
```

### 4. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

---

## 🌐 Deployment to Render

### Backend (Web Service)
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Connect your repository: `Purvijain1234/Traffic-Sign-Prediction-LLM`.
3. Configure settings:
   - **Environment**: `Python 3`
   - **Root Directory**: `.` (leave empty)
   - **Build Command**:
     ```bash
     git lfs install && git lfs pull && pip install -r requirements.txt
     ```
   - **Start Command**:
     ```bash
     uvicorn backend.app:app --host 0.0.0.0 --port $PORT
     ```
4. **Environment Variables**:
   - `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API key. If omitted, the app smoothly uses the built-in statutory knowledge engine.

### Frontend (Static Site)
1. In Render Dashboard, click **New +** -> **Static Site**.
2. Connect the same repository.
3. Configure settings:
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Redirects/Rewrites**, add two rules:
   - **Rule 1**: Source: `/api/*` ➔ Destination: `https://your-backend-name.onrender.com/api/*` (Action: `Rewrite`)
   - **Rule 2**: Source: `/*` ➔ Destination: `/index.html` (Action: `Rewrite`)

---

## 📄 License & Standards
Developed for university research, technical evaluation, and hackathons. Aligned with Indian Roads Congress (IRC:67-2022) specifications.