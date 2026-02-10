# Project Management System

Full-stack MERN application with real-time task management.

## Tech Stack

**Backend:** Express.js, MongoDB + Mongoose, Socket.IO, JWT Authentication

**Frontend:** React 18 + TypeScript, Vite, TanStack Query, Tailwind CSS, shadcn/ui

## Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Configure Environment

**backend/.env:**
```env
PORT=5000
JWT_SECRET=your_secret_key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/project-management?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```

**frontend/.env:**
```env
VITE_API_URL=http://localhost:5000
```

### 3. Run Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access

- Frontend: http://localhost:5173
- Login: `admin` / `admin123`

## Features

- ✅ JWT Authentication
- ✅ Project Management
- ✅ Kanban Task Board (To Do, In Progress, Done)
- ✅ Real-time Updates (Socket.IO)
- ✅ Task Priorities (Low, Medium, High)
- ✅ Responsive UI

## Project Structure

```
task/
├── backend/          # Express + MongoDB
│   ├── src/
│   │   ├── models/  # Mongoose models
│   │   ├── db.ts
│   │   ├── index.ts
│   │   └── routes.ts
│   └── .env
│
└── frontend/        # React + Vite
    ├── src/
    │   ├── components/
    │   ├── hooks/
    │   ├── pages/
    │   ├── types/
    │   └── lib/
    └── .env
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get user

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project

### Tasks
- `GET /api/projects/:projectId/tasks` - List tasks
- `POST /api/projects/:projectId/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Troubleshooting

**MongoDB Connection Error:**
- Verify MONGODB_URI in backend/.env
- Check MongoDB Atlas cluster is running
- Whitelist your IP in MongoDB Atlas

**Port Already in Use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**CORS Error:**
- Ensure backend runs on port 5000
- Verify CLIENT_URL in backend/.env
- Restart both servers

## Default Credentials

- Admin: `admin` / `admin123`
- Member: `member` / `member123`

## License

MIT
