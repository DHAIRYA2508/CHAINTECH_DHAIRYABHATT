# Task Management API 📝

A production-ready Node.js & Express.js REST API for managing tasks, built for the Node.js Internship Practical (NODEJSIIP-01909).

## 🚀 Features

- **Create Task**: Add new tasks with a title and description.
- **View All Tasks**: Retrieve a list of all tasks (newest first).
- **Mark as Completed**: Toggle task status to completed (with validation).
- **Edit Task**: Update the title and description of existing tasks.
- **Delete Task**: Remove tasks from the database.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Environment**: dotenv (for configuration)

## 📁 Project Structure

```text
CHAINTECH PRO/
├── index.js          # Main application file (Server, Database, Routes)
├── .env              # Configuration (Port, MongoDB URI)
├── .gitignore        # Ignored files (node_modules, .env)
├── package.json      # Dependencies and scripts
└── README.md         # Documentation
```

## ⚙️ Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DHAIRYA2508/CHAINTECH_DHAIRYABHATT.git
   cd CHAINTECH_DHAIRYABHATT
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add:
   ```text
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/task_manager
   ```

4. **Run the application**:
   ```bash
   # For production
   npm start
   
   # For development
   node index.js
   ```

## 🛣️ API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/tasks` | Create a new task |
| `GET` | `/tasks` | Fetch all tasks |
| `PATCH` | `/tasks/:id/complete` | Mark a task as completed |
| `PUT` | `/tasks/:id` | Edit a task title/description |
| `DELETE` | `/tasks/:id` | Delete a task |

## 💡 Key Decisions

- **Single-file Architecture**: Kept the core logic in `index.js` to ensure the project remains simple and easy to understand for beginners, while maintaining production-level error handling and validation.
- **Validation**: Implemented checks to ensure titles are not empty and tasks cannot be marked completed twice.
- **Sorting**: Tasks are fetched in descending order (`createdAt: -1`) to show the most recent tasks first.
