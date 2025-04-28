const API_URL = "https://gihsyu6j5e.execute-api.us-east-2.amazonaws.com/prod/tasks";

// Submit form to create a new task
document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const due_date = document.getElementById('due_date').value;
    const type = document.getElementById('type').value;

    // Validate the inputs
    if (!title || !due_date || !type) {
        alert("Please fill out all fields!");
        return;
    }

    const task = { title, due_date, type };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  // BACK TO JSON
            },
            body: JSON.stringify(task) // Proper JSON format
        });

        if (response.ok) {
            alert('Task added!');
            document.getElementById('taskForm').reset();
            loadTasks();
        } else {
            throw new Error('Error adding task.');
        }
    } catch (error) {
        console.error(error);
        alert('Error adding task.');
    }
});

// Function to load tasks from DynamoDB
async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        console.log('Response status:', response.status);

        const json = await response.json(); // Parse directly as JSON

        console.log('Parsed tasks:', json);

        if (!Array.isArray(json)) {
            console.error('Tasks is not an array!', json);
            return;
        }

        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        json.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

        json.forEach(task => {
            const li = document.createElement('li');
            li.textContent = `${task.title} - Due: ${task.due_date} [${task.type}]`;
            taskList.appendChild(li);
        });
    } catch (err) {
        console.error('LoadTasks error:', err);
    }
}


// Load tasks when the page is first loaded
loadTasks();
