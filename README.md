# Fiscora - Personal Finance Dashboard

Fiscora is a modern, full-stack expense tracking application designed to help you master your financial future. It features a secure REST API backend and a responsive, dark-mode capable React frontend.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
*   **Node.js** (v18 or higher)
*   **npm** (Node Package Manager)
*   **Git**

---

## 🚀 Quick Start Guide

This project is divided into two main folders:
*   `server` - The backend API (Node.js, Express, Prisma, SQLite/Postgres)
*   `client` - The frontend application (React, Vite, Tailwind CSS)

### 1. Backend Setup (Server)

Navigate to the server directory and set up the API.

```bash
cd server
```

**Step 1: Install Dependencies**
```bash
npm install
```

**Step 2: Configure Environment Variables**
Create a `.env` file in the `server` directory. Add variables line-by-line in `KEY=VALUE` format:
```env
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_super_secret_jwt_key_change_this"
```
*   `DATABASE_URL`: Defaults to a local SQLite file for development.
*   `JWT_SECRET`: Used to sign authentication tokens. Change this to a secure random string.

**Step 3: Database Migration**
Initialize the database using Prisma:
```bash
npx prisma migrate dev --name init
```

**Step 4: Start the Server**
```bash
# Development mode (auto-restarts on changes)
npm run dev

# OR Production mode
npm start
```
The server should now be running on `http://localhost:3000`.

---

### 2. Frontend Setup (Client)

Open a new terminal window, navigate to the client directory.

```bash
cd client
```

**Step 1: Install Dependencies**
```bash
npm install
```

**Step 2: Start the Development Server**
```bash
npm run dev
```

The application will start, typically at `http://localhost:5173`. Open this URL in your browser to inspect the app.

---

## 🛠️ Features & Usage

1.  **Authentication**: Register a new account or log in with existing credentials.
2.  **Dashboard**: View your total monthly spend and categorical breakdown chart.
3.  **Expenses**: Add, Edit, Filter, and Delete individual expense records.
4.  **Theme System**: Toggle between Light, Dark, and System themes using the icon on the home page.
5.  **Responsive**: Works seamlessly on Desktop, Tablet, and Mobile.

---

## ⚠️ Troubleshooting

**"No framework detected" on Vercel**
*   Ensure you select the `client` directory as the Root Directory in Vercel project settings, as that is where the frontend code lives.
*   Project names on Vercel must be lowercase (e.g., `fiscora`).

**CORS Errors**
*   If the frontend cannot talk to the backend, ensure the `server` is running on port 3000.
*   Check that no other service is blocking `http://localhost:3000`.

**Prisma Errors**
*   If you see database errors, try deleting the `server/prisma/dev.db` folder and running `npx prisma migrate dev` again to reset the database.
