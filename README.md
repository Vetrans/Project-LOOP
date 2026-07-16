# 🚀 LOOP — AI Customer Feedback Intelligence Platform

LOOP is a **multi-tenant SaaS platform** that helps organizations transform customer feedback into actionable insights using Artificial Intelligence.

Support tickets, surveys, app reviews, emails, and customer conversations often accumulate faster than teams can analyze them. LOOP centralizes this feedback, automatically classifies it, identifies trends, generates Voice of Customer reports, and enables users to ask natural language questions about customer sentiment through **Ask LOOP**.

Built with a modern microservice architecture using **React**, **Node.js**, **MongoDB**, **FastAPI**, and **Claude AI**.

---

# ✨ Features

- 🏢 Multi-tenant SaaS architecture
- 🔐 Secure JWT Authentication
- 👥 Role-Based Access Control (Admin, Analyst, Viewer)
- 📊 Interactive dashboards
- 📥 Feedback inbox with search & filters
- 📁 CSV feedback import
- 🤖 AI-powered Ask LOOP assistant
- 📈 Trend & theme detection
- 📄 Voice of Customer (VoC) reports
- 🎨 Workspace branding & themes
- ⚡ Fast React frontend
- 🐍 Python AI service
- 🔒 Complete tenant isolation

---

# 🏗️ Project Architecture

```
loop/
│
├── loop-frontend/     React + Vite
├── backend/           Node.js + Express + MongoDB
└── ai-service/        Python + FastAPI
```

Each service has a dedicated responsibility.

| Service | Technology | Responsibility |
|----------|------------|----------------|
| **Frontend** | React + Vite | User Interface |
| **Backend** | Node.js + Express | Authentication, RBAC, APIs, Feedback Management, Reports |
| **AI Service** | FastAPI + Python | Ask LOOP AI Assistant & Claude Integration |

The frontend communicates **only** with the backend.

The backend communicates with the AI service whenever an AI response is required.

The AI service is the **only** component that calls the Anthropic Claude API.

---

# 🏢 Multi-Tenant SaaS

LOOP is designed as a **true multi-tenant application**.

Every company receives its own isolated workspace.

Each workspace contains:

- Members
- Feedback
- Reports
- Themes
- Dashboard
- AI conversations

Although every company shares the same deployment and database, the backend scopes every request using the authenticated user's **Workspace ID**, ensuring complete data isolation.

No company can access another company's information.

---

# 👥 User Roles

Each workspace contains exactly three user roles.

| Role | Permissions |
|------|-------------|
| **Admin** | Complete access, workspace management, member management |
| **Analyst** | Manage feedback, AI features, reports |
| **Viewer** | Read-only dashboards, reports, Ask LOOP |

All permissions are enforced **server-side**.

Unauthorized requests return **HTTP 403 Forbidden**.

---

# ⚙️ Tech Stack

## Frontend

- React
- Vite
- React Router
- Context API
- Pure CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## AI Service

- Python
- FastAPI
- Anthropic Claude API
- Local Embedding Search

---

# 📦 Prerequisites

Before running the project, install:

- Node.js **18+**
- npm
- Python **3.10+**
- pip
- MongoDB

Optional:

- Anthropic API Key

The application works without an API key using local summaries, but Ask LOOP becomes significantly more powerful when Claude is enabled.

---

# 🗄️ MongoDB Installation

## macOS

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

---

## Windows

Download MongoDB Community Edition:

https://www.mongodb.com/try/download/community

Choose:

> Install MongoDB as a Service

Verify installation:

```powershell
net start MongoDB
```

---

## Ubuntu / Debian

```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

---

## Docker

```bash
docker run -d \
--name loop-mongo \
-p 27017:27017 \
mongo:7
```

MongoDB should be available at

```
mongodb://127.0.0.1:27017
```

Verify:

```bash
mongosh --eval "db.runCommand({ ping: 1 })"
```

---

# 🚀 Backend Setup

```bash
cd backend

npm install

cp .env.example .env
```

Edit `.env`

Set a secure JWT secret.

Example:

```
JWT_SECRET=your_super_secure_secret
```

Seed the demo database:

```bash
npm run seed
```

Start the server:

```bash
npm run dev
```

Backend runs at:

```
http://localhost:4000
```

---

## Demo Accounts

| Role | Email | Password |
|------|--------|----------|
| Admin | admin@acme-demo.com | Password123! |
| Analyst | analyst@acme-demo.com | Password123! |
| Viewer | viewer@acme-demo.com | Password123! |

---

# 🤖 AI Service Setup

Open another terminal.

```bash
cd ai-service

python -m venv venv
```

Activate the environment

### Windows

```bash
venv\Scripts\activate
```

### macOS/Linux

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Copy the environment file

```bash
cp .env.example .env
```

Optionally add

```
ANTHROPIC_API_KEY=
```

Start the server

```bash
uvicorn main:app --reload --port 8000
```

Visit

```
http://localhost:8000/health
```

---

# 💻 Frontend Setup

Open a third terminal.

```bash
cd loop-frontend

npm install

cp .env.example .env

npm run dev
```

Frontend runs at

```
http://localhost:5173
```

Login using one of the demo accounts.

---

# 🧪 Try LOOP

After all services are running, explore the platform.

### 📊 Dashboard

- Customer analytics
- Charts
- Feedback statistics

---

### 📥 Inbox

- Browse feedback
- Search
- Filter
- Import CSV
- Add new feedback

---

### 📈 Trends

- AI-generated themes
- Drill down into related feedback

---

### 🤖 Ask LOOP

Ask questions such as:

> What are customers saying about onboarding?

The backend forwards only the user's workspace and query to the AI service, which retrieves relevant feedback and generates a grounded response using Claude.

---

### 📄 Reports

Generate Voice of Customer reports with AI-generated summaries.

---

### 👥 Members

(Admin Only)

- Invite members
- Change roles
- Manage workspace users

---

# 📂 Project Structure

```
loop/

├── loop-frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── context/
│   └── lib/
│
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── controllers/
│   ├── seed/
│   └── server.js
│
└── ai-service/
    ├── main.py
    ├── services/
    └── utils/
```

---

# 🔒 Security

LOOP follows security-first principles.

- JWT Authentication
- Server-side RBAC
- Protected API routes
- Workspace isolation
- Secure middleware
- Role validation
- No direct browser access to AI service

---

# 🧠 AI Workflow

```
User
   │
   ▼
Frontend
   │
   ▼
Backend
   │
   ▼
AI Service
   │
   ▼
Claude API
```

The browser never communicates directly with Claude.

Every AI request passes through the backend, ensuring authentication, authorization, and workspace isolation.

---

# 📌 Future Improvements

- Email invitations
- Slack integration
- Microsoft Teams integration
- Sentiment analytics
- Real-time notifications
- File attachments
- Mobile application
- Advanced analytics
- Team collaboration features

---

# 🤝 Contributing

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/my-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push your branch

```bash
git push origin feature/my-feature
```

5. Open a Pull Request

---

# 📄 License

This project is created for educational purposes and hackathon development.

---

# ❤️ Built With

- React
- Node.js
- Express.js
- MongoDB
- FastAPI
- Anthropic Claude
- JavaScript
- Python

---

## ⭐ If you like this project, don't forget to star the repository!