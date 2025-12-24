const STORAGE_KEY = 'todo-list-v1';

let todoList = loadTodos();

displayItem();

function loadTodos() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {
        console.error('Failed to parse todos from storage', e);
    }
    // default sample items with valid ISO dates
    return [
        { item: 'buy milk', dueDate: '2025-12-31' },
        { item: 'buy powder', dueDate: '2025-11-30' }
    ];
}

function saveTodos() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todoList));
    } catch (e) {
        console.error('Failed to save todos', e);
    }
}

function addTo() {
    const inputElement = document.querySelector('#todo-input');
    const dateElement = document.querySelector('#todo-date');
    const todoItem = (inputElement.value || '').trim();
    const todoDate = dateElement.value || '';

    if (!todoItem) {
        inputElement.focus();
        alert('Please enter a todo item.');
        return;
    }

    todoList.push({ item: todoItem, dueDate: todoDate });
    saveTodos();
    inputElement.value = '';
    dateElement.value = '';
    displayItem();
}

function deleteItem(index) {
    if (index < 0 || index >= todoList.length) return;
    todoList.splice(index, 1);
    saveTodos();
    displayItem();
}

function formatDate(iso) {
    if (!iso) return 'No date';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function displayItem() {
    const containerElement = document.querySelector('.todo-container');
    const countElement = document.querySelector('#todo-items');
    containerElement.innerHTML = '';

    if (!todoList.length) {
        containerElement.innerHTML = '<p class="empty">No todos yet. Add one above.</p>';
        countElement.textContent = '0 items';
        return;
    }

    const fragment = document.createDocumentFragment();
    todoList.forEach((entry, index) => {
        const itemWrap = document.createElement('div');
        itemWrap.className = 'todo-item';

        const spanText = document.createElement('span');
        spanText.className = 'todo-text';
        spanText.textContent = entry.item;

        const spanDate = document.createElement('span');
        spanDate.className = 'todo-date';
        spanDate.textContent = formatDate(entry.dueDate);

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'delete-btn';
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', () => deleteItem(index));

        itemWrap.appendChild(spanText);
        itemWrap.appendChild(spanDate);
        itemWrap.appendChild(delBtn);
        fragment.appendChild(itemWrap);
    });

    containerElement.appendChild(fragment);
    countElement.textContent = `${todoList.length} item${todoList.length === 1 ? '' : 's'}`;
}
