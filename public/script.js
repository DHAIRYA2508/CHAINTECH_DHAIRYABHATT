const API_URL = '/tasks';
let allTasks = [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', fetchTasks);

async function fetchTasks() {
    try {
        const res = await fetch(API_URL);
        allTasks = await res.json();
        applyFilterAndSearch();
        updateStats(allTasks);
    } catch (err) {
        console.error('Failed to fetch tasks', err);
    }
}

function updateStats(tasks) {
    document.getElementById('totalTasks').textContent = tasks.length;
    document.getElementById('pendingTasks').textContent = tasks.filter(t => !t.completed).length;
    document.getElementById('completedTasks').textContent = tasks.filter(t => t.completed).length;
}

function filterBy(filter) {
    currentFilter = filter;
    
    // Update Active Link UI
    document.querySelectorAll('.nav-links a').forEach(el => el.classList.remove('active'));
    document.getElementById(`nav-${filter}`).classList.add('active');
    
    applyFilterAndSearch();
}

function handleSearch() {
    applyFilterAndSearch();
}

function applyFilterAndSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = allTasks;

    // 1. Filter by Status (Sidebar)
    if (currentFilter === 'pending') {
        filtered = filtered.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = filtered.filter(t => t.completed);
    }

    // 2. Filter by Search Query
    if (query) {
        filtered = filtered.filter(task => 
            task.title.toLowerCase().includes(query) || 
            task._id.toLowerCase().includes(query)
        );
    }

    renderTasks(filtered);
}

function renderTasks(tasks) {
    const tbody = document.getElementById('taskTableBody');
    tbody.innerHTML = '';

    if (tasks.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 3rem; color: var(--text-muted)">No tasks matching your criteria.</td></tr>`;
        return;
    }

    tasks.forEach(task => {
        const row = document.createElement('tr');
        const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Date';
        
        row.innerHTML = `
            <td><span class="task-id">#${task._id.slice(-6)}</span></td>
            <td>
                <div class="task-title" style="${task.completed ? 'text-decoration: line-through; color: var(--text-muted)' : ''}">${task.title}</div>
                <div class="task-desc">${task.description || 'N/A'}</div>
            </td>
            <td><span class="badge badge-${task.category.toLowerCase()}">${task.category}</span></td>
            <td>
                <span class="status-dot ${task.completed ? 'status-completed' : 'status-pending'}"></span>
                <span style="font-size: 0.85rem">${task.completed ? 'Completed' : 'Pending'}</span>
            </td>
            <td style="font-size: 0.85rem; color: var(--text-muted)">${formattedDate}</td>
            <td class="actions">
                <button class="action-btn ${task.completed ? 'undo' : ''}" onclick="toggleStatus('${task._id}')" title="${task.completed ? 'Undo' : 'Complete'}">
                    <i class="fas ${task.completed ? 'fa-rotate-left' : 'fa-check-circle'}" style="color: ${task.completed ? 'var(--warning)' : 'var(--success)'}"></i>
                </button>
                <button class="action-btn" onclick="editTask('${task._id}')" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" onclick="deleteTask('${task._id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function toggleStatus(id) {
    try {
        const res = await fetch(`${API_URL}/${id}/toggle`, { method: 'PATCH' });
        if (res.ok) fetchTasks();
    } catch (err) {
        console.error('Update error', err);
    }
}

// Modal & Other functions remain similar but updated to call applyFilterAndSearch
function openModal(editMode = false) {
    const modal = document.getElementById('taskModal');
    document.getElementById('modalTitle').textContent = editMode ? 'Edit Task Details' : 'Create New Task';
    if (!editMode) {
        document.getElementById('taskId').value = '';
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('category').value = 'Work';
        document.getElementById('dueDate').value = '';
    }
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('taskModal').classList.remove('active');
}

async function saveTask() {
    const id = document.getElementById('taskId').value;
    const taskData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        dueDate: document.getElementById('dueDate').value
    };

    if (!taskData.title) return alert('Task title is mandatory.');

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });

        if (res.ok) {
            closeModal();
            fetchTasks();
        } else {
            const err = await res.json();
            alert(err.message || 'Operation failed');
        }
    } catch (err) {
        console.error('Save error', err);
    }
}

async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) fetchTasks();
    } catch (err) {
        console.error('Delete error', err);
    }
}

async function editTask(id) {
    const task = allTasks.find(t => t._id === id);
    if (!task) return;

    document.getElementById('taskId').value = task._id;
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('category').value = task.category;
    if (task.dueDate) {
        document.getElementById('dueDate').value = new Date(task.dueDate).toISOString().split('T')[0];
    }
    
    openModal(true);
}
