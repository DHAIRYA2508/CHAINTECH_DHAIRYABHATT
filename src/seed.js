require('dotenv').config();
const mongoose = require('mongoose');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/task_manager')
    .then(() => console.log('✅ Connected to MongoDB for seeding...'))
    .catch(err => console.error('❌ Connection error:', err));

// Task Schema
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: { type: Boolean, default: false },
    dueDate: Date,
    category: String,
    createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

const seedTasks = [
    {
        title: "Initial System Architecture Review",
        description: "Review the current backend architecture and suggest improvements for scalability.",
        category: "Work",
        dueDate: new Date(Date.now() + 86400000 * 2),
        completed: true
    },
    {
        title: "Database Indexing Optimization",
        description: "Analyze slow queries and implement proper indexing for the MongoDB collections.",
        category: "Urgent",
        dueDate: new Date(Date.now() + 86400000 * 1),
        completed: false
    },
    {
        title: "API Security Audit",
        description: "Conduct a thorough security audit of all REST endpoints and implement rate limiting.",
        category: "Work",
        dueDate: new Date(Date.now() + 86400000 * 5),
        completed: false
    },
    {
        title: "Update Project Documentation",
        description: "Finalize the API documentation and architecture diagrams for the team.",
        category: "Personal",
        dueDate: new Date(Date.now() + 86400000 * 3),
        completed: false
    }
];

const seedDB = async () => {
    try {
        await Task.deleteMany({}); // Clear existing data
        await Task.insertMany(seedTasks);
        console.log('🚀 Database Seeded with Professional Tasks!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
