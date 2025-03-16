//config
const appendLocation = '#user-list';
const CACHE_DURATION = 24 * 60 * 60 * 1000; 

const style = document.createElement('style');
style.textContent = `
    .user-card {
        border: 1px solid #ccc;
        padding: 10px;
        margin: 5px;
    }
    .delete-btn {
        background:rgb(204, 34, 34);
        color: white;
        border: none;
        padding: 5px;
        cursor: pointer;
    }
    #refresh-users {
        padding: 10px;
        background:rgb(35, 35, 225);
        color: white;
        border: none;
        cursor: pointer;
    }
`;
document.head.appendChild(style);

const fetchUsers = async () => {
    try {
        const response = await new Promise(resolve => {
            resolve([
                { id: 1, name: 'Lionel', surname: 'Messi' },
                { id: 2, name: 'Cristiano', surname: 'Ronaldo' },
                { id: 3, name: 'Vinicius', surname: 'Jr' },
                { id: 4, name: 'Kylian', surname: 'Mbappé' },
                { id: 5, name: 'Erling', surname: 'Haaland' }
            ]);
        });
        return response;
    } catch (error) {
        console.error('Error users when fetching', error);
        return [];
    }
};
const createUserCard = user => {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.innerHTML = `
        <p>Name: ${user.name} ${user.surname}</p>
        <p>ID: ${user.id}</p>
        <button class="delete-btn" data-id="${user.id}">Delete</button>
    `;
    return card;
};
const renderUsers = users => {
    const container = document.querySelector(appendLocation);
    container.innerHTML = '';
    users.forEach(user => container.appendChild(createUserCard(user)));
};
const deleteUser = userId => {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users = users.filter(user => user.id !== userId);
    localStorage.setItem('users', JSON.stringify(users));
    renderUsers(users);
    checkList();
};
const isCacheExpired = () => {
    const timestamp = localStorage.getItem('usersTimestamp');
    return !timestamp || (Date.now() - parseInt(timestamp) > CACHE_DURATION);
};
const showRefreshButton = () => {
    const container = document.querySelector(appendLocation);
    const refreshBtn = document.createElement('button');
    refreshBtn.id = 'refresh-users';
    refreshBtn.textContent = 'Refresh Users';
    container.appendChild(refreshBtn);
    
    refreshBtn.addEventListener('click', async () => {
        if (!sessionStorage.getItem('usedrefresh')) {
            const users = await fetchUsers();
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('usersTimestamp', Date.now().toString());
            renderUsers(users);
            sessionStorage.setItem('usedrefresh', 'true');
            refreshBtn.remove();
        } else {
            console.log('Refresh can only be one per sessiomn');
        }
    });
};
const checkList = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) showRefreshButton();
};
const setupMutationObserver = () => {
    const container = document.querySelector(appendLocation);
    const observer = new MutationObserver(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (container.children.length === 0 && users.length === 0) showRefreshButton();
    });
    observer.observe(container, { childList: true, subtree: true });
};
const init = async () => {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.length === 0 || isCacheExpired()) {
        users = await fetchUsers();
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('usersTimestamp', Date.now().toString());
    }
    
    renderUsers(users);
    setupMutationObserver();
    
    document.querySelector(appendLocation).addEventListener('click', e => {
        if (e.target.classList.contains('delete-btn')) {
            const userId = parseInt(e.target.dataset.id);
            deleteUser(userId);
        }
    });
};




init();