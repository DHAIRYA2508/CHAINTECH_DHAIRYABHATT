require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// --- Production Middlewares ---
app.use(helmet({
    contentSecurityPolicy: false, // Disabled for simple frontend integration
})); 
app.use(cors());
app.use(morgan('dev')); // Professional request logging
app.use(express.json());
app.use(express.static('public')); 

// Database Connection
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('✅ Production Database Connected'))
        .catch((err) => console.error('❌ Database Connection Error:', err));
}

// Task Schema & Model
const taskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Title is mandatory'], 
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: { 
        type: String, 
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date },
    category: { 
        type: String, 
        enum: ['Work', 'Personal', 'Urgent', 'Others'], 
        default: 'Others' 
    },
    createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

// --- REST API Endpoints ---

// 1. Create Task
app.post('/tasks', async (req, res) => {
    try {
        const { title, description, dueDate, category } = req.body;
        const newTask = new Task({ title, description, dueDate, category });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
});

// 2. Fetch All Tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

// 3. Toggle Status (Complete/Undo)
app.patch('/tasks/:id/toggle', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.completed = !task.completed;
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ status: 'fail', message: 'Invalid ID format' });
    }
});

// 4. Update Task
app.put('/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
});

// 5. Delete Task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task successfully deleted' });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: 'Invalid ID format' });
    }
});

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'up', timestamp: new Date() });
});

module.exports = app;
