# HRMS Lite

A lightweight Human Resource Management System for managing employee records and tracking daily attendance.

**Live Demo:** [ethara-ai-psi.vercel.app](https://ethara-ai-psi.vercel.app) &nbsp;|&nbsp; **API:** [ethara-ai-qbak.onrender.com/api](https://ethara-ai-qbak.onrender.com/api/)

---

## Tech Stack

| Layer    | Technology   |
|----------|--------------|
| Frontend | React (Vite) |
| Backend  | Django + DRF |
| Database | PostgreSQL   |

---

## Features

### Core
- **Employee Management** — Add, view, and delete employees (Employee ID, Full Name, Email, Department)
- **Attendance Tracking** — Mark daily attendance (Present / Absent) per employee
- **Attendance Records** — View per-employee attendance history
- **Dashboard** — Total employees count, present-day summary, attendance stats
- **Date Filter** — Filter attendance records by a specific date

### UI States
- Loading skeletons, empty states, and inline error messages throughout

---

## Edge Cases & Validations

### Employee (`POST /api/employees/`)
| Scenario | Response |
|---|---|
| Missing required field | `400` — `"This field is required."` |
| Blank string field | `400` — `"This field may not be blank."` |
| Invalid email format | `400` — `"Enter a valid email address."` |
| Duplicate email | `400` — `"employee with this email already exists."` |
| Duplicate Employee ID | `400` — `"employee with this employee id already exists."` |

### Attendance (`POST /api/attendance/`)
| Scenario | Response |
|---|---|
| Missing required field | `400` — `"This field is required."` |
| Invalid status (not Present/Absent) | `400` — `"is not a valid choice."` |
| Wrong date format | `400` — `"Use one of these formats instead: YYYY-MM-DD."` |
| Non-existent employee FK | `400` — `"Invalid pk - object does not exist."` |
| Duplicate attendance (same employee, same date) | `400` — unique constraint error |

---

## Local Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- **PostgreSQL** (must be installed and running — create a database before starting)

---

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```env
# PostgreSQL connection (individual vars for local dev)
DB_NAME=hrms_lite
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Optional — restrict CORS to your local frontend
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Run migrations and start the server:

```bash
python manage.py migrate
python manage.py runserver
```

API available at `http://localhost:8000/api/`

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

Create a `.env` file inside `frontend/`:

```env
# Points to your local Django backend
VITE_API_URL=http://localhost:8000/api
```

> Without this file, the app defaults to `http://localhost:8000/api` anyway. Only set it if you want to point to a different backend (e.g. the live Render URL).

