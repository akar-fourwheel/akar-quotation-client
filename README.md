# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# Main documentation

# 🚗 Car Dealership Management Platform

This is a full-stack platform designed to replace traditional Google Sheets-based workflows for car dealerships. The application manages customer quotations, vehicle bookings, stock, price lists, and more. Built using **React**, **Node.js**, **Express**, and **SQL**, the platform also includes robust **Role-Based Access Control (RBAC)**.

---

## 🛠️ Tech Stack

| Layer        | Technology                         |
|--------------|------------------------------------|
| Frontend     | React, Tailwind CSS / Material UI, Axios |
| Backend      | Node.js, Express.js                |
| Database     | MySQL / PostgreSQL                 |
| Authentication | JWT, bcrypt                      |
| RBAC         | Custom middleware-based            |
| Sync Utility | Google Sheets API + Cron Jobs      |
| Deployment   | Render / Railway / Vercel          |

---

## 🔐 User Roles

- **Admin** – Full access to all modules
- **Sales Advisor** – Manage quotations and customer data
- **Inventory Manager** – Manage stock and pricing
- **Auditor** – Read-only access and report downloads

---

## 📈 Features

- Customer management
- Vehicle quotation builder
- Booking and delivery tracking
- Vehicle stock and variant inventory
- Price list management
- Google Sheets → MySQL sync
- Role-based access with protected routes
- Activity logging and audit trail
- Exportable reports (Excel, PDF)

---

## 🗺️ Roadmap

### ✅ Phase 1: Planning & Requirements
- Understand operations and define user roles
- Design database schema (ERD)

### ✅ Phase 2: Project Setup
- Initialize backend with Express and SQL
- Setup frontend with React + router
- Create auth system with RBAC

### ✅ Phase 3: Core Modules
- Customer + quotation management
- Vehicle stock and inventory
- Booking workflow and status updates
- Price list upload/update tools

### ✅ Phase 4: Sync & Audit
- Daily sync from Google Sheets via API
- Action logs and admin reports

### ✅ Phase 5: UI & Testing
- Role-specific dashboards
- Filtering and search
- Notifications & responsiveness

### ✅ Phase 6: Deployment
- Backend + DB on Render/Railway
- Frontend on Vercel/Netlify
- Admin and user documentation

---