# Functional Requirement Document (FRD)
## Project: Internal Real-Time Project Management System

### 1. Overview
The Internal Real-Time Project Management System is a collaborative tool designed to help internal teams manage projects and tasks efficiently. The system emphasizes real-time updates, ensuring that all team members have a synchronized view of project progress without needing to refresh their browsers.

### 2. Core Features
- **User Authentication**: Secure login and session management using JWT.
- **Project Management**: Create, read, update, and delete (CRUD) projects.
- **Task Management**:
    - Create tasks within projects.
    - Update task status (e.g., To Do, In Progress, Done).
    - Assign tasks to users.
    - Delete tasks.
- **Real-Time Collaboration**:
    - Instant updates on task board when a task status changes.
    - Real-time notifications for task assignment (visual indicators).
    - Live view of active users (optional but recommended for presence).
- **Task Board View**: Kanban-style or List view to visualize task progress.

### 3. User Roles & Permissions
| Role | Permissions |
| :--- | :--- |
| **Admin** | Full access to all projects and tasks. Can manage user roles (future scope). |
| **Member** | Can view assigned projects. Can create and update tasks within those projects. Cannot delete projects. |

### 4. Assumptions
- The system is for internal use only; public sign-ups are disabled (invite-only or pre-seeded users).
- Users have stable internet connections for real-time features.
- Deployment targets are Render (Backend) and Vercel (Frontend), but developed in a Replit environment initially.

### 5. Out-of-Scope (Phase 1)
- User registration (users are pre-created or added via seed script).
- Complex permission granularities (e.g., "Viewer" role).
- File attachments for tasks.
- Email notifications.
- Mobile application.
- Billing or subscription management.
