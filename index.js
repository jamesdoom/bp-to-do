import './styles.css';
import greenPriorityImg from './images/greenPriority.svg';
import yellowPriorityImg from './images/yellowPriority.svg';
import redPriorityImg from './images/redPriority.svg';

class Todo {
    constructor(title, description, dueDate, priority, notes) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
    }
}

class Project {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
    }
}

let projects = [];
let activeProjectIndex = 0;

function deleteProject(index) {
    projects.splice(index, 1);
    if (projects.length === 0) {
        const generalProject = new Project('Default');
        projects.push(generalProject);
        activeProjectIndex = 0;
    } else {
        if (activeProjectIndex >= index && activeProjectIndex > 0) {
            activeProjectIndex--;
        } else if (activeProjectIndex >= projects.length) {
            activeProjectIndex = projects.length - 1;
        }
    }
    saveProjects();
    renderProjects();
    renderTodos(activeProjectIndex);
}

function deleteTodo(projectIndex, todoIndex) {
    projects[projectIndex].todos.splice(todoIndex, 1);
    saveProjects();
    renderTodos(projectIndex);
}

function createTodoElement(todo, projectIndex, todoIndex) {
    const todoElement = document.createElement('div');
    todoElement.classList.add('todo-item');

    const titleElement = document.createElement('h3');
    titleElement.textContent = todo.title || 'No Title';

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = todo.description ? `Description: ${todo.description}` : 'No Description';

    const dueDateElement = document.createElement('p');
    dueDateElement.textContent = todo.dueDate ? `Due Date: ${todo.dueDate}` : 'No Due Date';

    const priorityElement = document.createElement('img');
    switch (todo.priority) {
        case 'Low':
            priorityElement.src = greenPriorityImg;
            break;
        case 'Medium':
            priorityElement.src = yellowPriorityImg;
            break;
        case 'High':
            priorityElement.src = redPriorityImg;
            break;
    }
    priorityElement.alt = `Priority: ${todo.priority}`;

    const notesElement = document.createElement('p');
    notesElement.textContent = todo.notes ? `Notes: ${todo.notes}` : 'No Notes';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Done';
    deleteButton.addEventListener('click', () => deleteTodo(projectIndex, todoIndex));

    todoElement.appendChild(titleElement);
    todoElement.appendChild(descriptionElement);
    todoElement.appendChild(dueDateElement);
    todoElement.appendChild(priorityElement);
    todoElement.appendChild(notesElement);
    todoElement.appendChild(deleteButton);

    return todoElement;
}

function renderTodos(projectIndex) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

    const currentProject = projects[projectIndex];
    currentProject.todos.forEach((todo, todoIndex) => {
        const todoElement = createTodoElement(todo, projectIndex, todoIndex);
        todoList.appendChild(todoElement);
    });
}

function createProjectElement(project, index) {
    const projectElement = document.createElement('li');
    projectElement.textContent = project.name;
    projectElement.classList.add('project-item');
    if (index === activeProjectIndex) {
        projectElement.classList.add('active');
    }
    projectElement.addEventListener('click', () => setActiveProject(index));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteProject(index);
    });

    projectElement.appendChild(deleteButton);
    return projectElement;
}

function renderProjects() {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';

    projects.forEach((project, index) => {
        const projectElement = createProjectElement(project, index);
        projectList.appendChild(projectElement);
    });
}

function setActiveProject(index) {
    activeProjectIndex = index;
    renderProjects();
    renderTodos(activeProjectIndex);
}

function resetTodoForm() {
    document.getElementById('todo-title').value = '';
    document.getElementById('todo-description').value = '';
    document.getElementById('todo-duedate').value = '';
    document.querySelectorAll('input[name="priority"]').forEach((input) => {
        if (input.value === 'Low') {
            input.checked = true;
        } else {
            input.checked = false;
        }
    });
    document.getElementById('todo-notes').value = '';
}

document.getElementById('new-todo-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Capture form data
    const title = document.getElementById('todo-title').value;
    const description = document.getElementById('todo-description').value;
    const dueDate = document.getElementById('todo-duedate').value;
    const priority = document.querySelector('input[name="priority"]:checked').value;
    const notes = document.getElementById('todo-notes').value;

    // Create new Todo and add it to the current project
    if (title) { // Check if title is not empty
        const newTodo = new Todo(title, description, dueDate, priority, notes);
        projects[activeProjectIndex].addTodo(newTodo);

        // Save projects and render the new todo item
        saveProjects();
        renderTodos(activeProjectIndex);

        // Reset the form fields after the new todo is added and rendered
        resetTodoForm();
    }
});

document.getElementById('new-project-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const projectName = document.getElementById('project-name').value;
    const newProject = new Project(projectName);
    projects.push(newProject);
    saveProjects();
    setActiveProject(projects.length - 1);
});

function saveProjects() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

function loadProjects() {
    const savedProjects = JSON.parse(localStorage.getItem('projects'));
    if (savedProjects) {
        projects = savedProjects.map(project => {
            const loadedProject = new Project(project.name);
            project.todos.forEach(todo => {
                loadedProject.addTodo(new Todo(todo.title, todo.description, todo.dueDate, todo.priority, todo.notes));
            });
            return loadedProject;
        });
    }
}

function initializeProjects() {
    if (projects.length === 0) {
        const generalProject = new Project('General');
        projects.push(generalProject);
    }
    loadProjects();
    renderProjects();
    renderTodos(activeProjectIndex);
}

initializeProjects();


