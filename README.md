# LOOM — Collaborative Project Management

<p align="center">
  <img src="public/favicon.svg" alt="Loom" width="80"/>
</p>

**Loom** is a full-stack, Trello-style collaborative project management application. Organize work into boards, track tasks through a Kanban workflow with drag-and-drop, schedule deadlines on a calendar, and gain insights through real-time analytics — all backed by a persistent MongoDB database.

---

## ✨ Features

### 📋 Boards & Kanban
- Create, rename, duplicate, archive, and delete boards
- Custom board colors and favorite boards
- Kanban columns (To Do, Doing, Review, Done) with **drag-and-drop** task management
- Board data persisted in MongoDB — nothing lost on refresh

### ✅ Tasks
- Rich task details: description, priority (Low/Medium/High/Urgent), assignees, and labels
- **Due dates with exact times** via a visual calendar + time picker
- Checklists with progress tracking
- Task comments and a full **activity log** per task
- Task moves and updates saved to the database in real time

### 📅 Calendar
- **Month**, **Week**, and **Agenda** views
- Click any date to see every task due that day — with time, board, and priority
- Open task details directly from the calendar

### 📊 Analytics & Dashboard
- Dashboard with live stats: total boards/tasks, completed, in-progress, overdue, productivity
- Analytics computed from **real data**: project progress, task distribution, completion rate trends, weekly productivity, and member activity
- Chart error boundaries and empty states for new accounts

### 👥 Team & Notifications
- Invite and manage team members by role
- Notification system with unread indicators and read/unread states

### 🔐 Authentication & Roles
- Registration and login backed by the database
- JWT-based auth with protected routes
- Per-account isolated workspaces — new accounts start fresh
- Admin dashboard with user statistics and role distribution

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Radix UI, Zustand, React Router, Axios, Recharts, Framer Motion, dnd-kit, react-day-picker |
| **Backend** | Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, CORS, Nodemon |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repository
```bash
git clone https://github.com/Nethmika2233/Loom-Management-.git
cd Loom-Management-
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `backend/.env` file (ask the team lead for the values, they are not stored in Git):
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend:
```bash
npm run dev
```
✅ API running at `http://localhost:5000` — you should see *"Loom Management API is running..."*

### 3. Frontend setup
Open a **second terminal** in the repo root:
```bash
npm install
npm run dev
```
✅ App running at `http://localhost:5173`

### 4. Use it
Open **http://localhost:5173** in your browser, create an account, and start building boards. New accounts start with a clean, empty workspace.

> 💡 **Troubleshooting:** If the app loads but shows errors, make sure the backend terminal is still running on port 5000 and your `.env` values are correct.

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in, returns a JWT token |
| POST | `/api/auth/verify-otp` | Verify OTP code |
| GET | `/api/boards` | List all boards |
| GET | `/api/boards/:id` | Get a single board |
| POST | `/api/boards` | Create a board |
| PUT | `/api/boards/:id` | Update a board |
| DELETE | `/api/boards/:id` | Delete a board |
| GET | `/api/tasks?boardId=` | List tasks (optionally filtered per board) |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update / move a task |
| DELETE | `/api/tasks/:id` | Delete a task |

---

## 📁 Project Structure

```
├── src/                    # Frontend (React + TypeScript)
│   ├── pages/              # Dashboard, Boards, Calendar, Analytics, Team, auth pages
│   ├── components/         # board/, calendar/, charts/, dashboard/, team/, common/
│   ├── store/              # Zustand stores (boards, tasks, user, notifications)
│   ├── services/           # API layer (axios), auth, board, task, team services
│   └── routes/             # Lazy-loaded routes + error boundaries
├── backend/                # Backend (Node + Express)
│   ├── server.js           # Express app (port 5000)
│   ├── config/db.js        # MongoDB connection
│   ├── models/             # User, Board, Task schemas
│   ├── routes/             # /api/auth, /api/boards, /api/tasks
│   ├── controllers/        # Route handlers
│   └── middleware/         # JWT auth middleware
└── README.md
```

---

## 👥 Team

| Member | Area |
|---|---|
| Nethmika | Backend foundation, auth, dashboard, API integration |
| Aloka | Boards |
| Damindi | Calendar |
| Sasanka | Notifications |
| Linal | Analytics |
| Mahen | Team management |
| Okith | Tasks & task details |
| Movinya | Profile & settings |
| Venuja | Admin dashboard |
| Yenuli | Kanban & drag-and-drop |

---

## 📄 License

This project was developed for educational purposes as a university group project.
