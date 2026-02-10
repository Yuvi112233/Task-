# System Design Document

## 1. High-Level Architecture

The system follows a client-server architecture with real-time
communication.

- Frontend: React application running independently
- Backend: Node.js + Express REST API
- Database: MongoDB (source of truth)
- Real-time Layer: Socket.IO
- Authentication: JWT (stateless)

Frontend and backend are deployed and scaled independently.

---

## 2. Architecture Flow

1. Frontend loads initial data using REST APIs
2. User connects to Socket.IO after authentication
3. User joins a project-specific socket room
4. Any task update is persisted in MongoDB
5. Backend emits a socket event to the project room
6. All connected clients receive updates instantly
7. Users joining later fetch the latest state from MongoDB

---

## 3. Backend Architecture

The backend follows a layered architecture:

- **Routes**: Define API endpoints
- **Controllers**: Handle request/response
- **Services**: Business logic
- **Models**: MongoDB schemas
- **Sockets**: Real-time event handling
- **Middleware**: Authentication and error handling
- **Config**: Environment variables and DB connection

### File Responsibilities
- `app.ts`: Express app configuration and route registration
- `index.ts`: Server startup and Socket.IO initialization

---

## 4. API Design (Sample)

### Authentication
- POST `/api/auth/login` – Login user
- GET `/api/auth/me` – Get current user

### Projects
- GET `/api/projects` – Fetch user projects
- POST `/api/projects` – Create project

### Tasks
- GET `/api/projects/:projectId/tasks` – Fetch tasks
- POST `/api/projects/:projectId/tasks` – Create task
- PUT `/api/tasks/:id` – Update task
- DELETE `/api/tasks/:id` – Delete task

---

## 5. Database Design (MongoDB)

### User
- id
- username
- password (hashed)
- role

### Project
- id
- name
- members[]

### Task
- id
- title
- status (todo | in_progress | done)
- priority
- projectId
- assigneeId

---

## 6. Real-Time Communication Strategy

- Socket.IO is used for real-time updates
- Each project represents a socket room
- Users join the room when opening a project
- Task events are broadcast only to that room
- Events are emitted **after** successful database writes

### Socket Events
- `join_project`
- `task_created`
- `task_updated`
- `task_deleted`

---

## 7. Authentication Flow

1. User logs in via REST API
2. Backend validates credentials and issues JWT
3. JWT is sent with subsequent API requests
4. Socket connection is authenticated using JWT
5. Protected routes and socket events require valid token

---

## 8. Scalability Considerations
- Stateless REST APIs
- Socket rooms reduce unnecessary broadcasts
- MongoDB as single source of truth
- Architecture supports horizontal scaling
- Redis can be added for Socket.IO pub/sub if needed

---

## 9. Design Decisions & Trade-offs
- Socket.IO chosen over polling/webhooks for instant UI updates
- REST APIs used for reliability and statelessness
- Separate frontend/backend for independent deployment
- JWT chosen for simplicity and scalability
