const API_URL = '/tasks';
let allTasks = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', fetchTasks);

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

function setLoading(isLoading) {
    document.getElementById('loading').style.display = isLoading ? 'block' : 'none';
}

async function fetchTasks() {
    setLoading(true);
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch tasks');
        allTasks = await res.json();
        applyFilterAndSearch();
        updateStats(allTasks);
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        setLoading(false);
    }
}

function updateStats(tasks) {
    document.getElementById('totalTasks').textContent = tasks.length;
    document.getElementById('pendingTasks').textContent = tasks.filter(t => !t.completed).length;
    document.getElementById('completedTasks').textContent = tasks.filter(t => t.completed).length;
}

function filterBy(filter) {
    currentFilter = filter;
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

    if (currentFilter === 'pending') filtered = filtered.filter(t => !t.completed);
    else if (currentFilter === 'completed') filtered = filtered.filter(t => t.completed);

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
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 4rem; color: var(--text-muted)">
            <i class="fas fa-inbox" style="font-size: 2rem; display: block; margin-bottom: 1rem; opacity: 0.2"></i>
            No records found.
        </td></tr>`;
        return;
    }

    tasks.forEach(task => {
        const row = document.createElement('tr');
        const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '---';
        
        row.innerHTML = `
            <td><span class="task-id">#${task._id.slice(-6)}</span></td>
            <td>
                <div class="task-title" style="${task.completed ? 'text-decoration: line-through; opacity: 0.6' : ''}">${task.title}</div>
                <div class="task-desc">${task.description || 'No additional data'}</div>
            </td>
            <td><span class="badge badge-${task.category.toLowerCase()}">${task.category}</span></td>
            <td>
                <span class="status-dot ${task.completed ? 'status-completed' : 'status-pending'}"></span>
                <span style="font-size: 0.85rem">${task.completed ? 'Completed' : 'Active'}</span>
            </td>
            <td style="font-size: 0.85rem; color: var(--text-muted)">${formattedDate}</td>
            <td class="actions">
                <button class="action-btn" onclick="toggleStatus('${task._id}')" title="${task.completed ? 'Re-open' : 'Complete'}">
                    <i class="fas ${task.completed ? 'fa-rotate-left' : 'fa-check-circle'}" style="color: ${task.completed ? 'var(--warning)' : 'var(--success)'}"></i>
                </button>
                <button class="action-btn" onclick="editTask('${task._id}')" title="Edit"><i class="fas fa-pen-to-square"></i></button>
                <button class="action-btn delete" onclick="deleteTask('${task._id}')" title="Remove"><i class="fas fa-trash-can"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function toggleStatus(id) {
    try {
        const res = await fetch(`${API_URL}/${id}/toggle`, { method: 'PATCH' });
        if (!res.ok) throw new Error('Status update failed');
        const data = await res.json();
        showToast(`Task marked as ${data.completed ? 'completed' : 'active'}`);
        fetchTasks();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function saveTask() {
    const id = document.getElementById('taskId').value;
    const taskData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        dueDate: document.getElementById('dueDate').value
    };

    if (!taskData.title) return showToast('Task title is required', 'error');

    setLoading(true);
    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/${id}` : API_URL;
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });

        if (res.ok) {
            showToast(id ? 'Task updated successfully' : 'Task created successfully');
            closeModal();
            fetchTasks();
        } else {
            const errData = await res.json();
            throw new Error(errData.message || 'Operation failed');
        }
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        setLoading(false);
    }
}

async function deleteTask(id) {
    if (!confirm('This action cannot be undone. Confirm deletion?')) return;
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Deletion failed');
        showToast('Task removed from system');
        fetchTasks();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// UI Handlers
function openModal(editMode = false) {
    document.getElementById('modalTitle').textContent = editMode ? 'Modify Task' : 'Configure New Task';
    if (!editMode) {
        document.getElementById('taskId').value = '';
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('category').value = 'Work';
        document.getElementById('dueDate').value = '';
    }
    document.getElementById('taskModal').classList.add('active');
}

function closeModal() {
    document.getElementById('taskModal').classList.remove('active');
}

async function editTask(id) {
    const task = allTasks.find(t => t._id === id);
    if (!task) return;
    document.getElementById('taskId').value = task._id;
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('category').value = task.category;
    if (task.dueDate) document.getElementById('dueDate').value = new Date(task.dueDate).toISOString().split('T')[0];
    openModal(true);
}
