const API_URL = 'http://localhost:3000/tasks';

async function fetchTasks() {
    try {
        const res = await fetch(API_URL);
        const tasks = await res.json();
        renderTasks(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err);
    }
}

async function createTask() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    if (!title) return alert('Title is required!');

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, category })
        });
        
        if (res.ok) {
            document.getElementById('title').value = '';
            document.getElementById('description').value = '';
            fetchTasks();
        }
    } catch (err) {
        console.error('Error creating task:', err);
    }
}

async function completeTask(id) {
    try {
        const res = await fetch(`${API_URL}/${id}/complete`, { method: 'PATCH' });
        if (res.ok) fetchTasks();
    } catch (err) {
        console.error('Error completing task:', err);
    }
}

async function deleteTask(id) {
    if (!confirm('Are you sure?')) return;
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) fetchTasks();
    } catch (err) {
        console.error('Error deleting task:', err);
    }
}

function renderTasks(tasks) {
    const container = document.getElementById('tasks');
    container.innerHTML = tasks.length === 0 ? '<p style="text-align:center; color: var(--text-dim)">No tasks yet. Add one above!</p>' : '';
    
    tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = `task-card ${task.completed ? 'completed' : ''}`;
        div.innerHTML = `
            <div class="task-info">
                <h3>${task.title} <span class="badge">${task.category}</span></h3>
                <p>${task.description || 'No description'}</p>
            </div>
            <div class="task-actions">
                ${!task.completed ? `<button class="complete-btn" onclick="completeTask('${task._id}')">✓</button>` : ''}
                <button class="delete-btn" onclick="deleteTask('${task._id}')">🗑</button>
            </div>
        `;
        container.appendChild(div);
    });
}

// Initial fetch
fetchTasks();
