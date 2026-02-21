# HRMS Lite

A lightweight Human Resource Management System that allows an admin to manage employee records and track daily attendance.

## Tech Stack

| Layer    | Technology       |
|----------|------------------|
| Frontend | React (Vite)     |
| Backend  | Django (DRF)     |
| Database | PostgreSQL       |

## Local Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install django djangorestframework django-cors-headers psycopg2-binary python-dotenv
```

Create a `.env` file in `backend/`:

```
DB_NAME=hrms_lite
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

Create the database and run migrations:

```bash
createdb hrms_lite   # or use psql
python manage.py migrate
python manage.py runserver
```

Backend runs at `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## Features

- **Employee Management** — Add, view, and delete employees
- **Attendance Tracking** — Mark daily attendance (Present/Absent), view records per employee
- **Dashboard** — Total employees, today's attendance summary, present-day counts per employee
- **Date Filter** — Filter attendance records by date
- **Validations** — Required fields, email format, duplicate employee ID/email, duplicate attendance

## Assumptions & Limitations

- Single admin user (no authentication)
- Leave management, payroll, and advanced HR features are out of scope
