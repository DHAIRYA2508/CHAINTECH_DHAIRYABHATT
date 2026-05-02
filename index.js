require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ Could not connect to MongoDB', err));

// Task Schema & Model
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    dueDate: {
        type: Date
    },
    category: {
        type: String,
        enum: ['Work', 'Personal', 'Urgent', 'Others'],
        default: 'Others'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model('Task', taskSchema);

// ROUTES

// 1. CREATE a new task
app.post('/tasks', async (req, res) => {
    try {
        const { title, description, dueDate, category } = req.body;
        if (!title) return res.status(400).json({ message: 'Title is required' });

        const newTask = new Task({ title, description, dueDate, category });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
});

// 2. READ all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
});

// 3. MARK task as completed
app.patch('/tasks/:id/complete', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (task.completed) return res.status(400).json({ message: 'Task is already completed' });

        task.completed = true;
        await task.save();
        res.status(200).json({ message: 'Task marked as completed', task });
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
});

// 4. EDIT task
app.put('/tasks/:id', async (req, res) => {
    try {
        const { title, description, dueDate, category, completed } = req.body;
        
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, dueDate, category, completed },
            { new: true, runValidators: true }
        );

        if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task updated successfully', updatedTask });
    } catch (error) {
        res.status(500).json({ message: 'Error editing task', error: error.message });
    }
});

// 5. DELETE task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
});

// Basic Route
app.get('/', (req, res) => {
    res.send('Task Manager API is running!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
