# 🚀 LOOP — AI Customer Feedback Intelligence Platform

![React](https://img.shields.io/badge/React-Frontend-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-success)
![FastAPI](https://img.shields.io/badge/FastAPI-AI_Service-teal)
![Claude AI](https://img.shields.io/badge/Claude-AI-purple)

LOOP is a multi-tenant SaaS platform that transforms scattered customer feedback into actionable, AI-powered insights.

Support tickets, surveys, app reviews, feature requests, and sales notes accumulate faster than teams can analyze them. LOOP centralizes feedback, automatically classifies it, groups similar conversations into themes, detects emerging trends, and enables natural-language analysis through **Ask LOOP**, an AI assistant grounded in real customer data.

Unlike demo-only dashboards, LOOP stores all data in MongoDB and starts every new workspace with a mandatory onboarding flow and real persistence.

---

## ✨ Features

### Marketing Website
- Modern responsive landing page
- Feature, workflow, pricing, and FAQ sections
- EmailJS-powered Contact Us form
- Smooth user onboarding journey

### Authentication & Workspaces
- Secure JWT authentication
- Multi-tenant SaaS architecture
- Complete workspace isolation
- Mandatory onboarding flow
- Role-Based Access Control (Admin, Analyst, Viewer)

### Feedback Intelligence
- Feedback Inbox
- Search and filtering
- CSV import
- Manual feedback entry
- AI-powered classification
- Theme clustering
- Trend detection

### Analytics & Reporting
- Real MongoDB-powered analytics
- Sentiment breakdowns
- Category insights
- Rating distributions
- Voice of Customer (VoC) reports
- Historical report storage

### AI Features
- Ask LOOP AI assistant
- Evidence-grounded responses
- Claude AI integration
- FastAPI AI microservice
- Local fallback mode when no API key is configured

### Team Management
- Add members
- Edit roles
- Remove members
- Workspace-scoped permissions

---

## 🏗️ Architecture

```text
loop/
├── loop-frontend/      # React + Vite
├── backend/            # Node.js + Express + MongoDB
└── ai-service/         # Python + FastAPI
````

### System Overview

| Service    | Technology        | Responsibility                                         |
| ---------- | ----------------- | ------------------------------------------------------ |
| Frontend   | React + Vite      | Landing page, onboarding, authentication, dashboard UI |
| Backend    | Node.js + Express | Authentication, RBAC, APIs, feedback, team and reports |
| Database   | MongoDB           | Single source of truth                                 |
| AI Service | FastAPI           | AI analysis and Ask LOOP                               |
| AI Model   | Claude AI         | Natural language reasoning                             |

### Request Flow

```text
Browser
   │
   ▼
Frontend (React)
   │
   ▼
Backend (Express)
   │
   ▼
AI Service (FastAPI)
   │
   ▼
Claude AI
```

The browser never communicates directly with Claude AI. All feedback, reports, users, settings, onboarding data, and workspace information are persisted in MongoDB through the backend.

---

## 👥 User Roles

| Role    | Permissions                                            |
| ------- | ------------------------------------------------------ |
| Admin   | Full workspace management, reports, users, AI features |
| Analyst | Manage feedback, analytics, reports, AI features       |
| Viewer  | Read-only access                                       |

All permissions are enforced server-side. Unauthorized requests return **403 Forbidden**.

---

## 🚀 Quick Start

### Prerequisites

* Node.js 18+
* Python 3.10+
* MongoDB Community Edition
* Git

Optional:

* Anthropic API Key
* EmailJS Account
* MongoDB Compass

### Backend

```bash
cd backend
npm install
npm run dev
```

### AI Service

```bash
cd ai-service
python -m venv venv
pip install -r requirements.txt

uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd loop-frontend
npm install
npm run dev
```

Frontend:
[http://localhost:5173](http://localhost:5173)

Backend:
[http://localhost:4000](http://localhost:4000)

AI Service:
[http://localhost:8000](http://localhost:8000)

---

## 🌱 Demo Data

Seed the platform with sample workspaces and feedback:

```bash
npm run seed
```

### Demo Accounts

| Role    | Email                                                 | Password     |
| ------- | ----------------------------------------------------- | ------------ |
| Admin   | [admin@acme-demo.com](mailto:admin@acme-demo.com)     | Password123! |
| Analyst | [analyst@acme-demo.com](mailto:analyst@acme-demo.com) | Password123! |
| Viewer  | [viewer@acme-demo.com](mailto:viewer@acme-demo.com)   | Password123! |

Clear all data:

```bash
npm run clear
```

---

## 🧑‍💻 Using LOOP

### Creating a Workspace

1. Open the landing page
2. Click **Get Started**
3. Register a new account
4. Complete onboarding
5. Access your dashboard

Every new workspace is isolated and receives its own data scope.

### Dashboard

* KPI cards
* Charts
* Workspace analytics
* Trend visualizations

### Feedback Inbox

* Search
* Filter
* CSV Import
* Manual Entry
* AI Classification

### Analytics

* Feedback trends
* Sentiment analysis
* Category breakdowns
* Rating distributions
* AI-generated insights

### Ask LOOP

Ask questions like:

> What are the biggest complaints this month?

> Which feature requests are growing fastest?

> What trends appeared after the latest release?

Answers are generated using workspace-specific feedback and supporting evidence.

### Reports

Generate and download Voice of Customer reports based on real feedback data.

---

## 🔒 Security

* JWT Authentication
* bcrypt Password Hashing
* Workspace Isolation
* Server-side RBAC
* Protected API Routes
* AI Service Isolation
* Claude API Keys never exposed to browsers
* Secure EmailJS integration

---

## 📂 Project Structure

```text
loop/
├── loop-frontend/
├── backend/
└── ai-service/
```

---

## 📌 Roadmap

* Email invitations
* Slack integration
* Microsoft Teams integration
* Webhooks
* Real-time notifications
* Personalized AI preferences
* Custom dashboards
* PDF/Excel exports
* Advanced analytics
* MongoDB Atlas support

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* Framer Motion
* Recharts
* EmailJS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Zod

### AI

* Python
* FastAPI
* Claude AI

---

## ❤️ Built With

React • Vite • Node.js • Express.js • MongoDB • FastAPI • Claude AI • EmailJS

---

## 📄 License

This project is intended for educational and portfolio purposes.

```

This keeps **everything important from the original README**, removes repetitive explanations, and makes it look like a polished SaaS project README that would fit well on GitHub, LinkedIn, and a portfolio.
```
