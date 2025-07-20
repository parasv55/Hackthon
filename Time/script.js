function updateClock() {
    const now = new Date();
    const clockDisplay = document.getElementById('clock');
    clockDisplay.textContent = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}
setInterval(updateClock, 1000);
updateClock();

// World Clock functionality
function updateWorldClocks() {
    const now = new Date();
    
    for (let i = 1; i <= 3; i++) {
        const timezone = document.getElementById(`timezone${i}`).value;
        const time = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
        document.getElementById(`clock${i}`).textContent = time.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
}

for (let i = 1; i <= 3; i++) {
    document.getElementById(`timezone${i}`).addEventListener('change', updateWorldClocks);
}

setInterval(updateWorldClocks, 1000);
updateWorldClocks();

// Pomodoro Timer functionality
let pomodoroTime = 25 * 60; // 25 minutes
let pomodoroInterval;
let pomodoroRunning = false;
let isWorkTime = true;
let cycles = 0;

function updatePomodoro() {
    const minutes = Math.floor(pomodoroTime / 60);
    const seconds = pomodoroTime % 60;
    document.getElementById('pomodoroTime').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    if (pomodoroTime <= 0) {
        isWorkTime = !isWorkTime;
        if (isWorkTime) {
            cycles++;
            document.getElementById('cycleCount').textContent = `${cycles}/4`;
            pomodoroTime = 25 * 60; // 25 minutes work time
        } else {
            pomodoroTime = 5 * 60; // 5 minutes break time
        }
        document.getElementById('pomodoroStatus').textContent = isWorkTime ? 'Work Time' : 'Break Time';
        
        
        const audio = new Audio('data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vm//}');
        audio.play();
        
        if (Notification.permission === "granted") {
            new Notification(isWorkTime ? "Back to Work!" : "Take a Break!", {
                body: isWorkTime ? "25 minutes work session started" : "5 minutes break started"
            });
        }
    }
    pomodoroTime--;
}

document.getElementById('startPomodoro').addEventListener('click', () => {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
    
    if (!pomodoroRunning) {
        pomodoroInterval = setInterval(updatePomodoro, 1000);
        pomodoroRunning = true;
        document.getElementById('startPomodoro').textContent = 'Pause';
    } else {
        clearInterval(pomodoroInterval);
        pomodoroRunning = false;
        document.getElementById('startPomodoro').textContent = 'Start';
    }
});

document.getElementById('resetPomodoro').addEventListener('click', () => {
    clearInterval(pomodoroInterval);
    pomodoroRunning = false;
    isWorkTime = true;
    cycles = 0;
    pomodoroTime = 25 * 60;
    document.getElementById('startPomodoro').textContent = 'Start';
    document.getElementById('pomodoroStatus').textContent = 'Work Time';
    document.getElementById('cycleCount').textContent = '0/4';
    updatePomodoro();
});

let stopwatchInterval;
let stopwatchTime = 0;
let stopwatchRunning = false;

function updateStopwatch() {
    const hours = Math.floor(stopwatchTime / 3600);
    const minutes = Math.floor((stopwatchTime % 3600) / 60);
    const seconds = stopwatchTime % 60;
    document.getElementById('stopwatch').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

document.getElementById('startStopwatch').addEventListener('click', () => {
    if (!stopwatchRunning) {
        stopwatchInterval = setInterval(() => {
            stopwatchTime++;
            updateStopwatch();
        }, 1000);
        stopwatchRunning = true;
        document.getElementById('startStopwatch').textContent = 'Stop';
    } else {
        clearInterval(stopwatchInterval);
        stopwatchRunning = false;
        document.getElementById('startStopwatch').textContent = 'Start';
    }
});

document.getElementById('resetStopwatch').addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    stopwatchRunning = false;
    document.getElementById('startStopwatch').textContent = 'Start';
    updateStopwatch();
});

let timerInterval;
let timerTime = 0;
let timerRunning = false;

function updateTimer() {
    if (timerTime <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        document.getElementById('startTimer').textContent = 'Start';
        alert('Timer finished!');
        return;
    }
    
    const minutes = Math.floor(timerTime / 60);
    const seconds = timerTime % 60;
    document.getElementById('timer').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerTime--;
}

document.getElementById('startTimer').addEventListener('click', () => {
    if (!timerRunning) {
        const minutes = parseInt(document.getElementById('minutes').value) || 0;
        const seconds = parseInt(document.getElementById('seconds').value) || 0;
        if (minutes === 0 && seconds === 0) return;
        
        timerTime = minutes * 60 + seconds;
        timerInterval = setInterval(updateTimer, 1000);
        timerRunning = true;
        document.getElementById('startTimer').textContent = 'Stop';
    } else {
        clearInterval(timerInterval);
        timerRunning = false;
        document.getElementById('startTimer').textContent = 'Start';
    }
});

document.getElementById('resetTimer').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerRunning = false;
    document.getElementById('startTimer').textContent = 'Start';
    document.getElementById('minutes').value = '';
    document.getElementById('seconds').value = '';
    document.getElementById('timer').textContent = '00:00';
});

const todos = [];

function addTodo() {
    const todoInput = document.getElementById('todoInput');
    const todoTime = document.getElementById('todoTime');
    
    if (!todoInput.value) return;
    
    const todo = {
        id: Date.now(),
        text: todoInput.value,
        time: todoTime.value,
        completed: false
    };
    
    todos.push(todo);
    updateTodoList();
    
    todoInput.value = '';
    todoTime.value = '';
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        updateTodoList();
    }
}

function deleteTodo(id) {
    const index = todos.findIndex(t => t.id === id);
    if (index !== -1) {
        todos.splice(index, 1);
        updateTodoList();
    }
}

function updateTodoList() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    
    todos.sort((a, b) => {
        if (!a.time) return 1;
        if (!b.time) return -1;
        return a.time.localeCompare(b.time);
    });
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = todo.completed ? 'completed' : '';
        
        const todoText = document.createElement('span');
        todoText.textContent = `${todo.text} ${todo.time ? `(${todo.time})` : ''}`;
        
        const actions = document.createElement('div');
        actions.className = 'todo-actions';
        
        const completeBtn = document.createElement('button');
        completeBtn.textContent = todo.completed ? 'Undo' : 'Complete';
        completeBtn.onclick = () => toggleTodo(todo.id);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.backgroundColor = '#ff4444';
        deleteBtn.onclick = () => deleteTodo(todo.id);
        
        actions.appendChild(completeBtn);
        actions.appendChild(deleteBtn);
        
        li.appendChild(todoText);
        li.appendChild(actions);
        todoList.appendChild(li);
    });
}

document.getElementById('addTodo').addEventListener('click', addTodo);
document.getElementById('todoInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});
