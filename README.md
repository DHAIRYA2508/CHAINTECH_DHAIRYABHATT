# 🚀 TaskMaster Pro: Enterprise Task Management Platform

**TaskMaster Pro** is a high-performance, production-ready Task Management application built with a modern Node.js ecosystem. Designed with enterprise-grade aesthetics and architecture, it demonstrates full-stack proficiency, rigorous testing, and secure API design.

---

## ✨ Key Features

- **Intelligence Dashboard**: Real-time KPI tracking for task progression.
- **Advanced CRUD Operations**: Scalable management of task lifecycles.
- **Universal Search**: Instant filtering by task title or unique Serial ID.
- **SaaS Aesthetics**: Responsive, dark-themed dashboard with sidebar navigation and modal-driven workflows.
- **Production Middlewares**: Integrated Security (Helmet), CORS, and Request Logging (Morgan).
- **Quality Assurance**: Automated unit testing suite using Jest and Supertest.
- **Persistence Layer**: Structured data management via MongoDB and Mongoose.
- **Professional Feedback**: Non-blocking Toast notifications and loading state management.

---

## 🛠️ Technical Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Object Data Modeling via Mongoose)
- **Security**: Helmet, CORS
- **Logging**: Morgan (Development/Production request monitoring)
- **Frontend**: Modern HTML5, CSS3 (Variables, Flex, Grid), Vanilla JavaScript (Fetch API)
- **Testing**: Jest, Supertest

---

## 📁 Project Architecture

```text
CHAINTECH PRO/
├── src/
│   ├── app.js        # Core Express application logic & middleware
│   ├── server.js     # Entry point for production server
│   └── seed.js       # Database seeding script for prerequisite data
├── public/           # Frontend assets (Static assets, UI logic)
├── tests/            # Automated Unit & Integration tests
├── .env              # Environment configuration (Keys & URIs)
├── package.json      # Dependency management & build scripts
└── README.md         # Professional documentation
```

---

## ⚙️ Professional Setup Instructions

### 1. Prerequisites
Ensure **Node.js (v16+)** and **MongoDB** are installed on your environment.

### 2. Environment Configuration
Create a `.env` file in the root directory:
```text
PORT=3000
MONGODB_URI=mongodb://localhost:27017/task_manager
```

### 3. Installation & Seeding
```bash
# Install dependencies
npm install

# Populate the system with professional prerequisite data
node src/seed.js
```

### 4. Deployment
```bash
# Start the production server
npm start
```

### 5. Verification
```bash
# Execute automated test suite
npm test
```

---

## 💡 Architectural Decisions

1.  **Modular Refactor**: Separated `app.js` from `server.js` to enable clean test environments, preventing port collision during CI/CD or testing.
2.  **Security-First Design**: Implemented `Helmet` for HTTP header security and strict `Mongoose` schema validation to ensure data integrity.
3.  **UI/UX Excellence**: Opted for a "Toast" notification system over standard alerts to provide a non-intrusive, premium user experience.
4.  **Database Seeding**: Developed a standalone seeding script to ensure a rich "out-of-the-box" experience for evaluators.
5.  **Status Toggling**: Implemented a state-aware toggle for task completion, allowing for intuitive "Undo" actions.

---
**Author**: Dhairya Bhatt  
**Project ID**: NODEJSIIP-01909
