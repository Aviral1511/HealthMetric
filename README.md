<div align="center">
  <h1>🧠 HealthMetric — AI-Powered Vaccine Market Intelligence Dashboard</h1>
  
  <p>An advanced full-stack analytics platform for exploring global vaccine market trends with interactive visualizations, smart filtering, and Generative AI insights.</p>

  <p>
    <a href="https://health-metric-beta.vercel.app/"><b>Live Demo (Frontend)</b></a>
  </p>
</div>

---

## 🌟 Overview

HealthMetric is a modern analytics dashboard designed to explore synthetic global vaccine market data through dynamic filters, KPI summaries, interactive charts, and AI-generated insights.

The platform combines React, Node.js, and Gemini GenAI to deliver both traditional visualization and conversational analytics in a single interface.

Users can:

- Filter datasets by region, brand, and year
- View real-time KPI updates
- Explore multiple interactive chart types
- Generate AI insights automatically
- Ask questions directly to the dataset using natural language

---

## 🚀 Key Features

### 📊 Interactive Analytics Dashboard

Includes 5+ chart types:

- **Line Chart** (market growth trends)
- **Bar Chart** (regional comparisons)
- **Pie Chart** (brand distribution)
- **Area Chart** (demand evolution)
- **Scatter Plot** (price vs market size)

### 🎯 Smart KPI Cards

Displays dynamically calculated:

- **Market Size**
- **Average Vaccine Price**
- **CAGR** (Compound Annual Growth Rate)

_Each KPI updates automatically based on selected filters._

### 🔎 Dynamic Dataset Filtering

Supports filtering by:

- Region
- Vaccine Brand
- Year

_Filters trigger real-time backend queries for efficient data retrieval._

### 🤖 AI Insight Generator

Automatically produces structured dataset insights such as:

> _"Asia demonstrates the highest CAGR after 2020, driven primarily by Pfizer distribution expansion."_

_Powered by Gemini Flash model._

### 💬 Ask-the-Data Chatbot

Users can query the dataset using natural language:

> **Example:** "Which region is growing fastest after 2021?"
>
> _Returns context-aware analytical responses._

### 🧠 Natural Language Filters

> **Example input:** "Show Pfizer sales in Asia after 2020"
>
> _Converted automatically into structured API filters._

### 📈 KPI Explanation Engine

Transforms numerical KPIs into business-friendly explanations.

> **Example**
> CAGR: 6.4%
> **AI Output:** _Indicates steady expansion across emerging vaccine markets._

### 🌗 Light / Dark Mode Support

Seamless UI theme switching powered by Tailwind CSS.

### 📄 Pagination & Sorting

Efficient dataset navigation via:

- `?page=2`
- `?sort=market_size`

_Improves performance and scalability._

### 🛡️ Offline AI Fallback Mode

Dashboard continues working even if Gemini API is unavailable using simulated insight responses. Ensures reliability during evaluation.

---

## 🧩 System Architecture

```text
React Dashboard (Frontend)
        ↓
Axios API Layer
        ↓
Node.js + Express Backend
        ↓
Dataset Engine (JSON / CSV)
        ↓
Gemini AI Insight Layer
```

---

## 🛠️ Tech Stack

### Frontend

- React (Vite)
- Tailwind CSS
- Recharts
- Axios

### Backend

- Node.js
- Express.js
- Gemini Flash API
- dotenv
- CORS

### Deployment

- **Frontend** → Vercel
- **Backend** → Render

---

## 📡 API Endpoints

### Dataset Routes

| Method | Endpoint                | Description                    |
| :----- | :---------------------- | :----------------------------- |
| `GET`  | `/api/vaccines`         | Fetch filtered vaccine dataset |
| `GET`  | `/api/vaccines/filters` | Fetch dropdown filter values   |
| `GET`  | `/api/vaccines/summary` | Retrieve KPI metrics           |

**Example:**
`/api/vaccines?region=Asia&brand=Pfizer&year=2022`

### AI Insight Routes

| Method | Endpoint                        | Description                |
| :----- | :------------------------------ | :------------------------- |
| `POST` | `/api/insights`                 | Generate dataset insights  |
| `POST` | `/api/insights/nlp`             | Convert text into filters  |
| `POST` | `/api/insights/ask`             | Ask dataset questions      |
| `POST` | `/api/insights/kpi-explanation` | Explain KPI values         |
| `POST` | `/api/insights/report`          | Generate executive summary |

### 📊 Example AI Interaction

> **User:** "Which brand dominates Asia after 2020?"
>
> **Response:** _"Pfizer dominates Asia post-2020 with the highest distribution volume and strongest CAGR contribution."_

---

## 📁 Project Structure

```text
HealthMetric/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── data/
│   ├── utils/
│   ├── app.js
│   └── server.js
│
└── frontend/
    ├── public/
    └── src/
        ├── components/
        │   ├── Charts/
        │   └── UI/
        ├── pages/
        ├── services/
        ├── index.css
        └── main.jsx
```

---

## ⚙️ Installation Guide

### Clone Repository

```bash
git clone https://github.com/Aviral1511/HealthMetric.git
cd HealthMetric
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

_Runs server on: `http://localhost:5000`_

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

_Runs app on: `http://localhost:5173`_

### 🔐 Environment Variables

Create `.env` inside the `backend` folder:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_api_key_here
```

_(App still works without API key using fallback insights.)_

---

## 📸 Screenshots


<img width="1857" height="981" alt="image" src="https://github.com/user-attachments/assets/a82fbaa7-17e8-4d7f-82dd-cacb68e8641b" />
<img width="1475" height="1046" alt="image" src="https://github.com/user-attachments/assets/1d11b4b3-495c-4264-92f4-95f526eaf864" />
<img width="1455" height="917" alt="image" src="https://github.com/user-attachments/assets/2445fa33-3d54-4931-832a-090d2ee65cab" />
<img width="1876" height="1049" alt="image" src="https://github.com/user-attachments/assets/1a76f035-38f7-47e5-8bec-11166def47f0" /> 

---

## ⚡ Performance Optimizations

Includes:

- Server-side filtering
- Pagination support
- Skeleton loading states
- Modular controller structure
- Lightweight dataset parsing
- API fallback resilience

## 🔐 Security Considerations

- Environment variable protection using dotenv
- Restricted CORS configuration
- Sanitized AI prompts
- Graceful API failure handling

## 🧠 GenAI Capabilities

Gemini integration enables:

- Dataset insight generation
- Conversational analytics
- Natural language filters
- KPI explanation engine
- Executive summary reporting

_Transforms traditional dashboards into intelligent analytics systems._

---

## ☁️ Deployment

- **Frontend deployed on:** Vercel
- **Backend deployed on:** Render

**Update environment variable after deployment:**

```env
VITE_API_URL=your_backend_url
```

---

## 🔭 Future Improvements

Planned upgrades include:

- PostgreSQL analytics database
- Role-based authentication
- Real-time updates via WebSockets
- Vector search for semantic queries
- Exportable PDF insight reports
- Predictive trend forecasting

---

## 👨‍💻 Author

- **Name - Aviral Tiwari**
- Contact: aviral.legend520@gmail.com
- Linkedin - https://www.linkedin.com/in/aviral-tiwari-78620524b/

_If you found this project interesting, feel free to connect or contribute ⭐_
