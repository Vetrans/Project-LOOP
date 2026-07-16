# 🚀 LOOP — AI Customer Feedback Intelligence Platform

LOOP is a **multi-tenant SaaS platform** that transforms scattered customer feedback into actionable, AI-powered insights.

Support tickets, surveys, app reviews, feature requests, and sales notes accumulate faster than teams can analyze them. LOOP centralizes this data, classifies it, groups similar feedback into themes, identifies emerging trends, and enables users to ask natural-language questions using **Ask LOOP**, an AI assistant grounded in real customer feedback.

The platform also includes a responsive marketing website with a fully functional **Contact Us** form powered by EmailJS.

---

## ✨ Features

- 🏠 Modern public landing page
- 📧 Working Contact Us form via EmailJS
- 🏢 Multi-tenant SaaS architecture
- 🔐 Secure JWT authentication
- 👥 Role-Based Access Control (Admin, Analyst, Viewer)
- 📊 Analytics dashboard
- 📥 Feedback Inbox with search, filters, and CSV import
- 🤖 AI-powered Ask LOOP assistant
- 📈 Trend & theme detection
- 📄 Voice of Customer (VoC) report generation
- 🐍 Separate FastAPI AI microservice
- 🔒 Complete workspace isolation

---

# 🏗️ Architecture

```
loop/
├── loop-frontend/      # React + Vite
├── backend/            # Node.js + Express + MongoDB
└── ai-service/         # Python + FastAPI
```

| Service | Technology | Responsibility |
|----------|------------|----------------|
| Frontend | React + Vite | Landing page, authentication, dashboard UI |
| Backend | Node.js + Express | Authentication, RBAC, APIs, feedback management |
| Database | MongoDB | Application data |
| AI Service | FastAPI | AI analysis and Ask LOOP |
| AI Model | Claude AI | Natural language reasoning |

### Request Flow

```
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

The browser never communicates directly with Claude AI.

---

# 👥 User Roles

| Role | Permissions |
|------|-------------|
| Admin | Full workspace management, users, reports, AI features |
| Analyst | Manage feedback, reports, AI features |
| Viewer | Read-only access |

Role permissions are enforced on the server. Unauthorized requests return **403 Forbidden**.

---

# 📦 Prerequisites

Install the following before running the project:

- Node.js 18+
- Python 3.10+
- MongoDB Community Edition
- Git

Optional:

- Anthropic API Key
- EmailJS Account

---

# 🗄️ 1. Install MongoDB

### Windows

Download MongoDB Community Server and install it as a Windows Service.

Start MongoDB:

```powershell
net start MongoDB
```

---

### macOS

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

---

### Ubuntu / Debian

```bash
sudo systemctl enable mongod
sudo systemctl start mongod
```

---

### Docker

```bash
docker run -d \
--name loop-mongo \
-p 27017:27017 \
mongo:7
```

Verify installation:

```bash
mongosh --eval "db.runCommand({ ping: 1 })"
```

---

# 🚀 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`

```env
MONGODB_URI=mongodb://127.0.0.1:27017/loop

JWT_SECRET=your_super_secret_key

PORT=4000

CLIENT_ORIGIN=http://localhost:5173

AI_SERVICE_URL=http://localhost:8000
```

Seed demo data:

```bash
npm run seed
```

Run backend:

```bash
npm run dev
```

Backend runs on

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

# 🤖 3. AI Service Setup

Open a new terminal.

```bash
cd ai-service

python -m venv venv
```

Activate environment.

Windows

```bash
venv\Scripts\activate
```

macOS / Linux

```bash
source venv/bin/activate
```

Install packages

```bash
pip install -r requirements.txt
```

Copy environment variables

```bash
cp .env.example .env
```

Edit `.env`

```env
MONGODB_URI=mongodb://127.0.0.1:27017/loop

ANTHROPIC_API_KEY=

ANTHROPIC_MODEL=claude-sonnet-4-6

PORT=8000
```

Start FastAPI

```bash
uvicorn main:app --reload --port 8000
```

Health endpoint

```
http://localhost:8000/health
```

---

# 💻 4. Frontend Setup

Open another terminal.

```bash
cd loop-frontend

npm install

npm install @emailjs/browser

cp .env.example .env
```

---

# 📧 5. Configure EmailJS

The Contact Us form sends emails directly using EmailJS.

### Step 1

Create a free account at EmailJS.

### Step 2

Create an Email Service.

Copy the

- Service ID

### Step 3

Create an Email Template using:

```
{{name}}

{{email}}

{{company}}

{{title}}

{{message}}
```

Copy the

- Template ID

### Step 4

Copy your Public Key.

Add everything to

```
loop-frontend/.env
```

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxx

VITE_EMAILJS_TEMPLATE_ID=template_xxxxx

VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Verify that `emailjs.send()` uses

```javascript
import.meta.env
```

---

# ▶️ 6. Run Frontend

```bash
npm run dev
```

Open

```
http://localhost:5173
```

---

# 🧑‍💻 Using LOOP

## New Workspace

1. Open the landing page.
2. Click **Get Started**.
3. Register a new account.
4. Enter:
   - Name
   - Company / Workspace
   - Email
   - Password
5. A new isolated workspace is automatically created.
6. The creator becomes the Admin.

---

## Existing Users

Visit

```
/login
```

Sign in with your workspace credentials or use one of the demo accounts.

---

## Landing Page

Navigation includes:

- Product
- Features
- Pricing
- Resources

The Contact section opens through:

- Contact Us
- Talk To Us

Emails are delivered using EmailJS.

---

## Inside the Application

### Dashboard

- KPI cards
- Charts
- Workspace analytics

### Feedback Inbox

- Search
- Filter
- CSV Import
- Manual feedback entry
- Automatic classification

### Trends

- Theme clustering
- Trend analysis
- Drill-down into feedback

### Ask LOOP

Ask natural-language questions like:

> What are the biggest complaints this month?

Answers are generated using your own feedback with supporting citations.

### Reports

Generate Voice of Customer reports.

### Members

(Admin only)

- Invite users
- Assign roles
- Manage workspace members

---

# 🔒 Security

- JWT Authentication
- bcrypt password hashing
- Workspace isolation
- Server-side RBAC
- AI service isolated from frontend
- Claude API never exposed to browsers
- EmailJS Public Key safely exposed according to EmailJS architecture

---

# 📂 Project Structure

```
loop/
│
├── loop-frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── styles/
│       └── lib/
│
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── seed/
│   └── server.js
│
└── ai-service/
    └── main.py
```

---

# 📌 Future Improvements

- Email invitations for new members
- Slack integration
- Microsoft Teams integration
- Webhooks
- Real-time notifications
- AI sentiment scoring
- Custom dashboards
- Export reports as PDF
- Advanced analytics

---

# 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router
- EmailJS

### Backend

- Node.js
- Express.js
- MongoDB
- JWT
- bcrypt

### AI

- Python
- FastAPI
- Claude AI

---

# ❤️ Built With

- React
- Vite
- Node.js
- Express.js
- MongoDB
- FastAPI
- Claude AI
- EmailJS

---

## 📄 License

This project is intended for educational and portfolio purposes.