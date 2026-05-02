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
        const { title, description } = req.body;
        
        // Basic validation: Title must not be empty
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const newTask = new Task({ title, description });
        await newTask.save(); // Save to MongoDB

        res.status(201).json(newTask); // Send back the created task
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error: error.message });
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
