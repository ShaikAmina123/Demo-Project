# Global Neochain — Asset Management Platform

Full-stack asset management system: **React + Express + MySQL**

## Quick Start (3 commands)

### Prerequisites
- **Node.js 18+** — [Download](https://nodejs.org)
- **MySQL Server** running on localhost

### Setup

```bash
# 1. Create the database (run in MySQL)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS neochain_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Setup backend
cd backend
cp .env.example .env          # Edit .env with your MySQL username/password
npm install
npm run seed                   # Creates tables + loads 71 sample assets

# 3. Setup frontend
cd ../frontend
npm install
```

### Run

Open **two terminals**:

```bash
# Terminal 1 — Backend API
cd backend
npm run dev                    # → http://localhost:3001

# Terminal 2 — Frontend
cd frontend
npm run dev                    # → http://localhost:5173
```

### Login
- **Email:** admin@globalneochain.com
- **Password:** admin123

## What's Included

| Feature | Details |
|---|---|
| **71 Assets** | Laptops, monitors, vehicles, HVAC, furniture, consumables, etc. |
| **11 Users** | Admin, managers, users, viewers across departments |
| **6 Licenses** | Office 365, Adobe CC, Salesforce, Slack, Jira, AutoCAD |
| **7 Work Orders** | Preventive, corrective, emergency, inspections |
| **5 Checkouts** | Active + overdue records |
| **5 Audits** | Full, spot check, cycle count, compliance |
| **7 Warranties** | Dell, Apple, Cisco, Toyota, CAT, Herman Miller, APC |
| **5 Vendor Contracts** | IT, janitorial, fire alarm, telecom, elevator |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login |
| GET | `/api/dashboard` | Dashboard stats |
| GET | `/api/assets` | List assets (search, filter, paginate) |
| POST | `/api/assets` | Create asset |
| GET | `/api/assets/:id` | Asset detail |
| PUT | `/api/assets/:id` | Update asset |
| DELETE | `/api/assets/:id` | Soft-delete asset |
| GET/POST | `/api/work-orders` | Work orders CRUD |
| GET/POST | `/api/checkouts` | Checkouts + check-in |
| GET/POST | `/api/licenses` | License management |
| GET/POST | `/api/audits` | Audit management |
| GET/POST | `/api/users` | User management |

## Tech Stack

- **Frontend:** React 18, Vite, React Router, Axios, Recharts
- **Backend:** Express.js, Sequelize ORM, JWT auth
- **Database:** MySQL with soft deletes
- **Auth:** bcrypt + JWT tokens

## Project Structure

```
global-neochain/
├── backend/
│   ├── src/
│   │   ├── config/database.js
│   │   ├── middleware/auth.js, errorHandler.js
│   │   ├── models/index.js        ← All 10 models
│   │   ├── routes/                 ← 8 route files
│   │   ├── seeds/seed.js           ← Full sample data
│   │   └── app.js                  ← Express server
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/Layout, Modal, Toast
│   │   ├── pages/Dashboard, Assets, WorkOrders...
│   │   ├── services/api.js
│   │   ├── hooks/useAuth.jsx
│   │   └── styles/global.css
│   └── package.json
├── setup-local.sh                  ← One-command setup
└── README.md
```
