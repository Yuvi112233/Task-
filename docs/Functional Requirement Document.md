# Functional Requirement Document (FRD)

## 1. Overview
This document defines the functional requirements for an internal
real-time Project Management System. The system is designed to help
teams manage projects and tasks collaboratively with instant updates
across multiple users.

The application is intended for internal organizational use only.

---

## 2. Core Features
- User authentication using JWT
- Role-based access (Admin, Member)
- Project creation and management
- Task creation, update, delete
- Task status management (Todo, In Progress, Done)
- Real-time task updates across users working on the same project
- Users joining later should always see the latest project state

---

## 3. User Roles & Permissions

### Admin
- Create and manage projects
- Add or remove members from projects
- Create, update, and delete tasks
- View all tasks within a project

### Member
- View assigned projects
- View tasks within a project
- Update task status
- Cannot delete projects

---

## 4. Assumptions
- The system is used internally by a company
- Users are pre-registered or created by an admin
- A limited number of concurrent users per project
- Stable internet connectivity is assumed

---

## 5. Out of Scope
- Email or push notifications
- File uploads or attachments
- Task comments or mentions
- Mobile application
- External integrations
