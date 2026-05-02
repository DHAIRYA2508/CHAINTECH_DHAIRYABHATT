# 🚀 TaskMaster Pro: Enterprise Task Management Platform

TaskMaster Pro is a high-performance, production-level Task Management application built with Node.js, Express, and MongoDB. It features a professional SaaS-style dashboard, full CRUD capabilities, data persistence, and automated unit testing.

---

## ✨ Enterprise Features

- **Dashboard Intelligence**: Real-time statistics on task progression.
- **Advanced Task Management**: Create, view, edit, and delete tasks with ease.
- **Search & Filter**: Instant search by Task Title or Unique ID.
- **SaaS Aesthetics**: Modern, responsive UI with sidebar navigation and modal interaction.
- **Persistence Layer**: Robust integration with MongoDB/Mongoose.
- **Quality Assurance**: Built-in unit tests using Jest and Supertest.
- **Bonus Capabilities**: Native support for Due Dates and Categories (Work, Urgent, Personal, etc.).

---

## 🛠️ Technical Architecture

### Core Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB / Mongoose
- **Testing**: Jest, Supertest
- **Styling**: Modern CSS3 (CSS Variables, Flexbox, Grid)

### Directory Structure
```text
CHAINTECH PRO/
├── src/
│   ├── app.js        # Express Application configuration
│   ├── server.js     # Entry point for the server
│   └── seed.js       # Database seeding script for prerequisite data
├── public/           # Frontend (HTML, CSS, Vanilla JS)
├── tests/            # Automated Unit Tests
├── .env              # Environment Configuration
├── package.json      # Dependencies and Scripts
└── README.md         # Documentation
```

---

## ⚙️ Professional Setup Instructions

### 1. Prerequisite
Ensure you have **Node.js** and **MongoDB** installed and running on your system.

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```text
PORT=3000
MONGODB_URI=mongodb://localhost:27017/task_manager
```

### 4. Database Seeding (Crucial)
To populate the application with professional "Prerequisite" data, run:
```bash
node src/seed.js
```

### 5. Running the Platform
```bash
# Development / Production
npm start
```

### 6. Running Tests
```bash
npm test
```

---

## 💡 Key Architectural Decisions

1.  **Separation of Concerns**: Refactored logic into `app.js` and `server.js` to allow for clean unit testing without port conflicts.
2.  **Stateless Frontend**: The UI uses Vanilla JavaScript with the Fetch API to interact with the backend, demonstrating an understanding of asynchronous programming.
3.  **Validation Middleware**: Implemented server-side validation to ensure data integrity (e.g., titles cannot be empty).
4.  **UX Focus**: Used a Modal-based workflow for editing to keep the user experience seamless and modern.
5.  **ID Management**: Every task is assigned a unique MongoDB `ObjectId`, displayed as a ticket number in the UI for a professional feel.
