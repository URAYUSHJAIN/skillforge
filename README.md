# SkillForge LMS

A modern Learning Management System built with React, Node.js, and PostgreSQL.

![SkillForge](https://img.shields.io/badge/SkillForge-LMS-0ea5e9)
![React](https://img.shields.io/badge/React-19-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169e1)

## 🚀 Features

- **User Authentication** - JWT-based login/register
- **Course Management** - Create, edit, delete courses with chapters & lectures
- **Enrollment System** - Track enrollments and progress
- **Contact Form** - User messages with admin management
- **Admin Dashboard** - Full admin panel for content management
- **Dark Theme** - Modern UI with dark theme

## 📁 Project Structure

```
L-M-S/
├── frontend/     # User-facing React app
├── admin/        # Admin panel React app
└── backend/      # Express.js API server
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, Tailwind CSS |
| Admin | React, Vite |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Neon) |
| Auth | JWT, bcryptjs |

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/URAYUSHJAIN/skillforge.git
cd skillforge
npm run install:all
```

### 2. Configure Environment

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=your-secret-key
PORT=4000
```

**Frontend** (`frontend/.env`):
```env
VITE_API_BASE=http://localhost:4000
```

**Admin** (`admin/.env`):
```env
VITE_API_BASE=http://localhost:4000
```

### 3. Setup Database

```bash
npm run db:setup
```

### 4. Run Development

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Admin: http://localhost:5174
- API: http://localhost:4000

## 🌐 Deployment

### Recommended Setup

| App | Platform | Root Directory |
|-----|----------|----------------|
| Frontend | Vercel | `frontend` |
| Admin | Vercel | `admin` |
| Backend | Render | `backend` |

### Vercel (Frontend/Admin)

1. Import repo → Set **Root Directory** to `frontend` or `admin`
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Add env: `VITE_API_BASE=https://your-backend.onrender.com`

### Render (Backend)

1. New Web Service → Connect repo
2. Root Directory: `backend`
3. Build: `npm install`
4. Start: `node server.js`
5. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/courses` | List courses |
| GET | `/api/courses/:id` | Course details |
| POST | `/api/bookings` | Enroll in course |
| POST | `/api/contacts` | Submit contact form |

## 🔐 Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `DATABASE_URL` | Backend | Neon PostgreSQL connection |
| `JWT_SECRET` | Backend | JWT signing key |
| `VITE_API_BASE` | Frontend/Admin | Backend API URL |

## 📝 License

MIT © Ayush Jain

---

Built with ❤️ by [URAYUSHJAIN](https://github.com/URAYUSHJAIN)
