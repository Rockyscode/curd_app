# 🎨 TaskMaster - React TypeScript Frontend

A modern, responsive React + TypeScript frontend for the **Spring Boot 3 To-Do CRUD REST API**.

---

## ✨ Features

- ⚡ **Vite + React 18 + TypeScript**: Lightning fast development and strong type safety.
- 🎨 **Tailwind CSS UI**: Clean, modern card-based interface with smooth animations and responsive design.
- 🌓 **Dark / Light Mode**: Seamless dark mode support with automatic system preference detection and localStorage persistence.
- 📊 **Dashboard Metrics**: Live stats for Total Tasks, In Progress, Completed, and a dynamic Progress Bar.
- 🔍 **Search & Filters**: Real-time filtering by status (All, Active, Completed), keyword search across titles/descriptions, and multi-mode sorting (Newest, Oldest, Alphabetical).
- 🔄 **Full CRUD Operations**:
  - **Create**: Add tasks with title & optional description.
  - **Read**: Live synchronization with Spring Boot REST API (`/api/todos`).
  - **Update**: Edit task details in a modal; instant 1-click completion toggle.
  - **Delete**: Task removal with confirmation modal to prevent accidental loss.
- 🛡️ **Graceful Fallback & Offline Demo Mode**: Seamlessly operates with local state if the Spring Boot backend is offline, with real-time backend connection health monitoring.
- 🔔 **Toast Notification System**: Instant feedback for user actions and connection changes.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🔗 Spring Boot API Integration

The frontend connects to the Spring Boot backend at `http://localhost:8080/api/todos`. Backend in VM Link `http://129.159.232.131:80/`

| Operation | HTTP Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Get All** | `GET` | `/api/todos` | Fetch all tasks |
| **Get By ID** | `GET` | `/api/todos/{id}` | Fetch a single task |
| **Create** | `POST` | `/api/todos` | Create a new task |
| **Update** | `PUT` | `/api/todos/{id}` | Update task details / status |
| **Delete** | `DELETE` | `/api/todos/{id}` | Delete a task |

---

## 📁 Directory Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ConnectionBanner.tsx    # Backend status banner & instructions
│   │   ├── DeleteConfirmModal.tsx  # Confirmation dialog for deletions
│   │   ├── EmptyState.tsx          # Zero-state and empty search graphics
│   │   ├── FilterBar.tsx           # Search input, status tabs, sort dropdown
│   │   ├── Navbar.tsx              # Brand header, live status, theme toggle
│   │   ├── StatsOverview.tsx       # KPI metrics & progress bar
│   │   ├── Toast.tsx               # Floating toast alerts
│   │   ├── TodoFormModal.tsx       # Create/Edit task modal dialog
│   │   ├── TodoItem.tsx            # Task card with toggle, edit & delete
│   │   └── TodoList.tsx            # Task list container & loading skeletons
│   ├── hooks/
│   │   └── useTheme.ts             # Dark/Light mode hook
│   ├── services/
│   │   └── api.ts                  # Axios client for Spring Boot REST API
│   ├── types/
│   │   └── todo.ts                 # TypeScript interfaces
│   ├── App.tsx                     # Main application layout & state management
│   ├── index.css                   # Tailwind CSS styling
│   └── main.tsx                    # React root entry
├── index.html                      # HTML template
├── package.json                    # Dependencies and scripts
├── tailwind.config.js              # Tailwind configuration
└── vite.config.ts                  # Vite config with API proxy
```
