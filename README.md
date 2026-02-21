# DevS Attendance System

A full-stack web application for managing event attendance, built for the DevS organization. It uses **Google Sheets** as the primary data store and provides a role-based interface for officers and admins to track attendance across events.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [Roles & Access Control](#roles--access-control)

---

## Overview

The system allows authorized users to:

1. Upload a Google Sheet containing student/member data for a specific event.
2. Mark attendance for each member in real time.
3. View past event attendance history.
4. Export attendance records to Excel (`.xlsx`) or as a zipped archive.
5. Manage user accounts (admin only).

All attendance data lives in Google Sheets — no traditional database is required.

---

## Features

| Feature | Description |
|---|---|
| **Authentication** | Username + password login with SHA-256 + salt hashing |
| **Protected Routes** | All pages require a valid session |
| **Role-Based Access** | Admin users can create new accounts and access all routes |
| **Upload Sheet** | Validate and register a Google Sheet for an event |
| **Attendance Marking** | Mark members present/absent with officer attribution |
| **On-Spot Registration** | Add walk-in members directly during an event |
| **History** | Browse all past events and their attendance data |
| **Export** | Download attendance as `.xlsx` or `.zip` |
| **Profile Page** | View logged-in user details |
| **Health Check** | `GET /api/health` endpoint for uptime monitoring |

---

## Tech Stack

### Backend

| Package | Purpose |
|---|---|
| Node.js + Express 5 | HTTP server and routing |
| `googleapis` | Google Sheets API v4 (read/write attendance data) |
| `helmet` | Security headers |
| `cors` | Cross-origin request handling |
| `morgan` | HTTP request logging |
| `xlsx` | Generate Excel export files |
| `archiver` | Zip multiple export files |
| `dotenv` | Environment variable loading |

### Frontend

| Package | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| shadcn/ui + Radix UI | Accessible component primitives |
| `react-router-dom` v7 | Client-side routing |
| `react-hook-form` | Form state management |
| `recharts` | Data visualisation / event stats |
| `sonner` | Toast notifications |
| `lucide-react` | Icon library |

---

## Project Structure

```
devs-attendance/
├── backend/
│   ├── server.js                  # Entry point — loads .env, starts server
│   ├── app.js                     # Express app setup (CORS, helmet, routes)
│   ├── routes/                    # Route definitions
│   │   ├── index.js               # Mounts all routers under /api
│   │   ├── loginRoutes.js
│   │   ├── createUserRoutes.js
│   │   ├── uploadSheetRoutes.js
│   │   ├── attendanceSheetRoutes.js
│   │   ├── HistoryRoutes.js
│   │   └── profileRoutes.js
│   ├── controller/                # Request handlers
│   ├── storage/                   # Google Sheets read/write logic
│   ├── middleware/
│   │   ├── googlesheetsapi.js     # Lazy-init Google Sheets client
│   │   ├── encrypter.js           # SHA-256 + salt password hashing
│   │   └── passwordChecker.js     # Password verification
│   └── models/                    # Data shape references (History, Sheets, Users)
│
└── frontend/
    ├── src/
    │   ├── App.tsx                # Router, protected routes, layout
    │   ├── components/            # Page-level components
    │   │   ├── LoginPage.tsx
    │   │   ├── UploadPage.tsx
    │   │   ├── AttendancePage.tsx
    │   │   ├── HistoryPage.tsx
    │   │   ├── SessionPage.tsx
    │   │   ├── EventStatsBasics.tsx
    │   │   ├── ProfilePage.tsx
    │   │   └── CreateUserPage.tsx
    │   ├── services/auth.ts       # Login, logout, session cache helpers
    │   ├── config/api.ts          # Base URL from VITE_API_URL env var
    │   └── components/ui/         # shadcn/ui component library
    └── build/                     # Production build output
```

---

## API Reference

All routes are prefixed with `/api`.

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/login` | No | Authenticate with username and password |
| `POST` | `/createuser` | Admin | Create a new user account |
| `POST` | `/upload` | Yes | Validate and register a Google Sheet |
| `GET` | `/attendance` | Yes | Fetch sheet data (cached in-memory) |
| `PATCH` | `/attendance` | Yes | Update commit/attendance status |
| `POST` | `/attendance/add` | Yes | Add a walk-in member on the spot |
| `GET` | `/attendance/export` | Yes | Export attendance as Excel/ZIP |
| `GET` | `/history` | Yes | List all past event records |
| `GET` | `/history/event` | Yes | Fetch details for a specific past event |
| `GET` | `/profile` | Yes | Get profile info for the logged-in user |
| `GET` | `/health` | No | Server health check |

---

## Environment Variables

### Backend (`backend/.env`)

```env
# Google Service Account credentials
GOOGLE_TYPE=service_account
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_PRIVATE_KEY_ID=your_private_key_id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
GOOGLE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
GOOGLE_CLIENT_CERT_URL=your_cert_url

# App config
PORT=3000
ATTENDANCE_SHEET=your_google_sheet_id
ALLOWED_ORIGIN=http://localhost:5173
```

> `ALLOWED_ORIGIN` accepts a comma-separated list for multiple origins, e.g.  
> `http://localhost:5173,https://your-app.vercel.app`

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000/api
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Cloud project with the Sheets API enabled
- A Google Service Account with editor access to the target spreadsheets

### 1. Clone the repository

```bash
git clone <repo-url>
cd devs-attendance
```

### 2. Set up the backend

```bash
cd backend
npm install
# Create .env and fill in the variables listed above
npm run dev        # development (watch mode)
# or
npm start          # production
```

The server starts on `http://localhost:3000`.

### 3. Set up the frontend

```bash
cd frontend
npm install
# Create .env with VITE_API_URL=http://localhost:3000/api
npm run dev        # development server on http://localhost:5173
# or
npm run build      # production build → frontend/build/
```

---

## Authentication

- Passwords are hashed with **SHA-256 + a random salt** before storage in Google Sheets.
- Session state is cached in **localStorage** (no server-side sessions).
- All routes except `/api/login` and `/api/health` require the user to be authenticated client-side.
- On page refresh, the app restores session from the localStorage cache automatically.

### Login flow

```
POST /api/login  { username, password }
      │
      ├─ Fetch salt + hash from Users sheet
      ├─ Recompute hash from supplied password + salt
      └─ Match? → return user row + admin flag
```

---

## Roles & Access Control

| Role | Capabilities |
|---|---|
| **User** | Login, upload sheet, mark attendance, view history, view profile |
| **Admin** | All user capabilities + create new user accounts |

Admin status is determined by a flag stored in the Users Google Sheet and returned by the login endpoint.
