# DevConnect

DevConnect is a professional portfolio and networking platform for developers. It allows engineers to create structured public portfolios, showcase repositories, select from beautiful gradient themes, and establish connections with other developers in the community.

Inspired by premium developer tools like Linear, Discord, Raycast, and Vercel, DevConnect features a sleek, dark mode glassmorphism interface.

---

## 🛠 Tech Stack

### Frontend
- **React 18** (UI Library)
- **React Router DOM** (Navigation)
- **Redux Toolkit** (Global State Management)
- **Tailwind CSS v3** (Utility-first Styling)
- **React Icons** (Glyphs and Vector Icons)
- **Native Fetch API** (Lightweight HTTP requests)

### Backend
- **Node.js** (Runtime Environment)
- **Express.js** (Web Server Framework)
- **Mongoose / MongoDB Atlas** (Object Data Modeling)
- **JWT (JSON Web Tokens)** (State-less Authentication)
- **bcryptjs** (Password Hashing)

### Security & DevOps Features
- **Helmet** (Security Headers)
- **Express Rate Limit** (DDoS and Brute-force Prevention)
- **Compression** (Gzip payload optimization)
- **Express Validator** (Strict server-side validation rules)

---

## 📁 Folder Structure

```
DevConnect/
├── client/                     # Frontend Application (Create React App)
│   ├── public/                 # Static public files (HTML, favicon)
│   └── src/
│       ├── components/         # Reusable UI components (Navbar, ProtectedRoute)
│       ├── layouts/            # Page layouts (Layout)
│       ├── pages/              # Routing pages (Dashboard, Directory, Profile, Settings, Login, Register)
│       ├── redux/              # RTK slices (auth, profiles, projects, connections) & store
│       ├── utils/              # Client utilities (Fetch API wrapper)
│       ├── App.js              # Root router and loader
│       ├── index.css           # Global custom scrollbars and Tailwind directives
│       └── index.js            # React mounting node
│
├── server/                     # Backend API Service (Express.js)
│   ├── config/                 # MongoDB clients
│   ├── controllers/            # Route logic controllers
│   ├── middleware/             # Protected authentication and error responders
│   ├── models/                 # Database Mongoose schemas
│   ├── routes/                 # Express REST endpoint maps
│   ├── utils/                  # JWT generators
│   ├── validators/             # Request payload schemas (express-validator)
│   ├── index.js                # Server entry point
│   ├── test_all_endpoints.js   # Automated API integration suite
│   └── test_auth.js            # Modular Auth test script
│
├── package.json                # Root package workspace mappings
└── README.md                   # Main documentation
```

---

## ⚙ Environment Configurations

Create a `.env` file in the respective folders using the templates below:

### Server Settings (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/devconnect
JWT_SECRET=your_jwt_secret_signing_key
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Client Settings (`client/.env`)
```env
DISABLE_ESLINT_PLUGIN=true
REACT_APP_API_URL=http://127.0.0.1:5000/api
```

---

## 🚀 Installation & Local Development

### 1. Prerequisite
Ensure you have **Node.js** (v18+) and **MongoDB** installed and running on your local machine.

### 2. Install Dependencies
Run `npm install` at the workspace root to install all dependencies for both workspace directories (root, client, and server) using npm workspaces:
```bash
npm install
```

### 3. Run Locally (Concurrent Development)
Launch both the Express backend and React development server concurrently from the root directory:
```bash
npm run dev
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

---

## 🧪 Integration Testing
We have built an automated integration suite inside the server directory that tests database cleanups, registration duplicate validation rules, JWT authentication cycles, profile updates, projects CRUD, directory filters, and cascade account deletions.

Run the test suite using:
```bash
cd server
node test_all_endpoints.js
```

---

## ☁ Production Deployment (Render)

This codebase is configured from Day 1 to deploy easily on Render as a **single unified Web Service**. In production mode (`NODE_ENV=production`), the Node.js Express server is configured to serve the React static build folder natively.

### Configure on Render
1. Create a new **Web Service** on Render and link your GitHub repository.
2. Configure settings:
   - **Environment**: `Node`
   - **Build Command**: `npm run build` (Installs workspace packages and compiles the React application into `client/build`).
   - **Start Command**: `npm start` (Runs the production server at `server/index.js`).
3. Under **Advanced Settings**, add the environment variables:
   - `MONGO_URI`: (Your production MongoDB Atlas connection string)
   - `JWT_SECRET`: (A strong random secret)
   - `NODE_ENV`: `production`
