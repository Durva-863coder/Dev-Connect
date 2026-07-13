# 🌐 DevConnect — Build Your Developer Identity

<p align="center">
  <img src="https://picsum.photos/id/180/800/400" alt="DevConnect Banner" width="100%" style="border-radius: 16px; border: 1px solid #334155;" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB Atlas" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="MIT License" />
</p>

---

## 📖 Introduction

**DevConnect** is a premium, startup-ready portfolio and networking platform for developers. Designed with a clean, dark mode aesthetic inspired by premium SaaS tools like *GitHub, Linear, Vercel, and Raycast*, it enables developers to create highly polished public profiles, showcase their project repositories, and connect with other engineers in a modern network grid.

---

## ✨ Key Features

* **💼 Professional Developer Profiles**: Restructured card-based public profile layout presenting avatar assets, bios, college references, locations, social contact grids, and chronological activity feeds.
* **🖼 16:9 Aspect Video Showcases**: Display portfolio builds with strict aspect ratio cards, lazy loading, and fail-safe image triggers (`onError`) resolving to local SVG vector placeholders.
* **💡 Smart Peer Recommendations**: A dynamic network recommendation engine ("People You May Know") that filters existing connections and requests to present suitable peers.
* **🔍 Advanced Directory Search**: Query the developer directory concurrently by keyword, technology tags, college name, and geographical location with multi-type sorting.
* **🛡 Enterprise-Grade Security**: Configured with Helmet CSP headers allowing development XHR callbacks, express-rate-limit buffers, cookie-parsers, and JWT authentication.
* **🌱 Realistic Indian Developer Seeder**: Seed script loading realistic engineering profiles from CGC Landran, VIT Vellore, BITS Pilani, etc., complete with diverse tech stacks and real connections.

---

## 🛠 Tech Stack

### 💻 Frontend
* **Core**: React 18.2.0 (pinned), React DOM 18.2.0 (strictly standard)
* **Router**: React Router DOM (protected path buffers)
* **State**: Redux Toolkit (auth, profile, and connection slices)
* **Styling**: Tailwind CSS (custom solid SaaS layout definitions)
* **Network**: Native Fetch API (zero-dependency lightweight queries)

### ⚙ Backend
* **Server**: Node.js & Express.js
* **Database**: MongoDB Atlas (Mongoose ODM bindings)
* **Security**: Helmet (disabling CORP strict checks), CORS, Express Rate Limit, Express Validator
* **Authentication**: Stateless JSON Web Tokens (JWT) stored in HTTP-only cookies, bcryptjs

---

## 📁 Project Folder Structure

```text
DevConnect/
├── client/                     # Frontend Application (React App)
│   ├── public/                 # Static assets & public configs
│   │   └── images/             # Vector SVGs & fallback images
│   └── src/
│       ├── assets/             # Local images & compile imports
│       ├── components/         # Modular components (Navbar, ProtectedRoute)
│       ├── layouts/            # Layout wraps (Navbar inclusion)
│       ├── pages/              # Route pages (Home, Dashboard, Directory, Profile, Settings)
│       ├── redux/              # Store configuration and RTK slices
│       └── utils/              # Client-side native Fetch API request blocks
│
├── server/                     # Backend API Service (Express.js)
│   ├── config/                 # Database configuration & seeding scripts
│   ├── controllers/            # Route controllers
│   ├── middleware/             # Validation injectors, Helmet config, and JWT checkers
│   ├── models/                 # Mongoose schema models (User, Project, Connection)
│   ├── routes/                 # Express API endpoint maps
│   ├── utils/                  # Cryptography signing scripts
│   └── validators/             # Request payload schemas (express-validator)
│
├── package.json                # Root workspaces configuration
└── README.md                   # Platform documentation
```

---

## ⚙ Environment Configurations

Create a `.env` file in the respective workspace folders to launch the servers:

### 1. Backend Server (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/devconnect
JWT_SECRET=super_secret_devconnect_key_123
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 2. Frontend Client (`client/.env`)
```env
DISABLE_ESLINT_PLUGIN=true
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🚀 Installation & Local Development

### 1. Prerequisites
Make sure you have **Node.js** (v18+) and **npm** installed.

### 2. Install Workspace Dependencies
Install root, client, and server packages simultaneously via npm workspaces:
```bash
npm install
```

### 3. Run Locally (Concurrently)
Spin up the hot-reloading development server for both frontend and backend directories:
```bash
npm run dev
```
* **Frontend Site**: `http://localhost:3000`
* **Backend REST API**: `http://localhost:5000`

---

## 🌱 Seeding Mock Data

To seed or refresh the database with our realistic developer profiles, run:
```bash
cd server
node config/force_seed.js
```
This cleans the active collections and inserts 8 developer accounts, 16 project builds, and connection networks.

---

## 🧪 Automated Testing

We have built an integrated automated validation suite that verifies database cleanups, registration duplicate validation rules, JWT authentication cycles, profile updates, projects CRUD, directory filters, and connection request declines.

Run tests:
```bash
cd server
node test_all_endpoints.js
```

---

## ☁ Production Deployment

This project is configured to build and deploy as a **unified service on Render**:
* **Build Command**: `npm run build` (wipes, resolves workspaces, and compiles the React application into `/client/build`).
* **Start Command**: `npm start` (runs the Express server which serves the React build static pages on `/` and mounts REST routes on `/api/*`).
* Set `NODE_ENV=production` in production settings to switch to production mode.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
