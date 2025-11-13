# 🌐 VarnueAI  
Secure full-stack user management system with role-based authentication, JWT, password hashing, admin panel, and a modern React UI.  
Built with **Node.js**, **Express**, **Supabase**, and **React (Vite + Tailwind CSS)**.

---

## ✨ Features

- 🔐 User Authentication (JWT based)
- 👥 Role-Based Access (User/Admin)
- 🔑 Password Hashing (bcrypt)
- 🛠️ Admin Dashboard (User management)
- ⚡ Fast React Vite frontend
- 🧵 Tailwind CSS styled UI
- 🗄️ Supabase as database
- 🚀 Fully API-driven architecture
- 🚀 Redux For State Management

---
# 🛠️ Installation & Setup

## 📌 1. Clone the Repository
```bash
Create New Folder and inside It Open Terminal
Below is command of Installation

git clone git@github.com:LokeshWagh/varnueAI.git
cd varnueAI
##Go to The Backend Folder
cd backend
 ### Installing backend dependencies
npm install
Paste the Env File In Backend Which i Provide In Email
npm start
```
Server Will run On :
 - http://localhost:4000
###📌 2). Frontend Set Up (React + Tailwind )
```bash
#Got To Frontend
cd ../frontend
Install frontend dependencies:
npm install
##Start Development Server
npm run dev
```
frontend Is run on :
 - http://localhost:5173

### API EndPoints :: 

| Method | Endpoint            | Description                    |
| ------ | --------------------| ------------------------------ |
| POST   | /api/signup         | SignUp                         |
| POST   | /api/login          | Login (JWT) password Hashing   |
| PUT    | /profile/:id        | Update Employee Data           |
| POST   | /api/forgot-password| For Sending OTP                |
| POST   | api/reset-password  | Admin: Fetch all users         |
| GET    | /api/users          | Admin: Fetch all users         |
| DELETE | /api/users/:id      | Admin: Delete user             |

 
