// config
const usersContainer = document.querySelector('.ins-api-users');
const API_URL = 'https://jsonplaceholder.typicode.com/users';
const CACHE_KEY = 'Users';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .ins-api-users {
            max-width: 900px;
            margin: 30px auto;
            font-family: 'Helvetica Neue';
            padding: 0 15px;
        }
        .user-card {
            border: none;
            padding: 20px;
            margin-bottom: 15px;
            border-radius: 8px;
            position: relative;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .user-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        .user-card h3 {
            margin: 0 0 10px;
            color: #2c3e50;
            font-size: 1.4em;
            font-weight: 600;
        }
        .user-card p {
            margin: 5px 0;
            color: #7f8c8d;
            font-size: 1em;
            line-height: 1.5;
        }
        .delete-btn {
            position: absolute;
            right: 20px;
            top: 20px;
            background: linear-gradient(45deg, #e74c3c, #c0392b);
            color: white;
            border: none;
            padding: 8px 16px;
            cursor: pointer;
            border-radius: 4px;
            font-weight: 500;
            transition: background 0.3s ease;
        }
        .delete-btn:hover {
            background: linear-gradient(45deg, #c0392b, #a93226);
        }
        .error-message {
            color: #e74c3c;
            text-align: center;
            padding: 20px;
            background: #fceae9;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);
}

function getData() {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (new Date().getTime() - timestamp < CACHE_DURATION) {
            return data;
        }
    }
    return null;
}
function setData(data) {
    const cacheObject = {
        data: data,
        timestamp: new Date().getTime()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
}
function render(users) {
    usersContainer.innerHTML = '';
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-card';
        userDiv.innerHTML = `
            <h3>${user.name}</h3>
            <p>Email: ${user.email}</p>
            <p>Address: ${user.address.street}, ${user.address.city}</p>
            <button class="delete-btn" data-id="${user.id}">Delete</button>
        `;
        usersContainer.appendChild(userDiv);
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteUser);
    });
}
function deleteUser(event) {
    const userId = parseInt(event.target.dataset.id);
    let users = getData();
    if (users) {
        users = users.filter(user => user.id !== userId);
        setData(users);
        render(users);
    }
}
function fetchUsers() {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not fetch from API");
            }
            return response.json();
        })
        .then(data => {
            setData(data);
            render(data);
        })
        .catch(error => {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = `Error: ${error.message}`;
            usersContainer.appendChild(errorDiv);
        });
}
function init() {
    addStyles();
    const cachedUsers = getData();
    if (cachedUsers) {
        render(cachedUsers);
    } else {
        fetchUsers();
    }
}

init();