function formateDate(string) {

    // dd/mm/yy hh:mm:ss
    const date = new Date(string);
    let day = date.getDay()
    let month = date.getMonth()
    let year = date.getFullYear()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let seconds = date.getSeconds();

    return `${day}/${month}/${year} ${hour}:${minute}:${seconds}`;
}

class Storage {

    task = {
        backlog: [],
        progress: [],
        done: []
    }

    constructor () {
        const data = this.getAllTask();
        const task = data ?? this.setup()

        Object.assign(this.task, task);
    }
    
    setup = () => {
        const data = {
            backlog: [],
            progress: [],
            done: []
        }

        localStorage.setItem('index', '0');
        localStorage.setItem('task', JSON.stringify(data));

        return data;
    }

    getIndex = () => {
        let index = Number(localStorage.getItem('index'))
        localStorage.setItem('index', ++index);

        return index;
    }
    
    getAllTask = () => {
        return JSON.parse(localStorage.getItem('task'));
    }

    getTask = (id, column) => {
        const json = this.task;

        return json[column].filter(i => i.id == id)[0];
    }

    save = (task) => {
        this.task.backlog.push(task);
        localStorage.setItem('task', JSON.stringify(this.task));
    }

    replace = (task, column) => {
        let index = this.task[column].findIndex(i => i.id === task.id);

        this.task[column][index] = { ...this.task[column][index], ...task }
        localStorage.setItem('task', JSON.stringify(this.task));
    }

    update = (task, newColumn, previousColumn) => {

        if (newColumn === 'progress') {
            // if (!task.startTime) task.startTime = new Date()
            // if (!task.responsible) task.responsible = 'test@gmail.com';
        }

        if (newColumn === 'done') {
            task.endTime = new Date();
        }

        this.task[previousColumn] = this.task[previousColumn].filter(i => i.id != task.id);
        this.task[newColumn].push(task);    
        localStorage.setItem('task', JSON.stringify(this.task));

        return task;
    }

    delete = (id, column) => {
        this.task[column] = this.task[column].filter(i => i.id != id);
        localStorage.setItem('task', JSON.stringify(this.task));
    }

}

class Card {
 
    // column = 'backlog' | 'progress' | 'done'
    // mode = 'read' | 'write'

    constructor (column, data, mode = 'read') {

        const card = document.createElement('div');
        card.id = data.id;
        card.classList.add('card');
        card.setAttribute('draggable', 'true');
        
        if (mode === 'read') {

            if (column === 'backlog') {
                card.innerHTML = `
                    <div class="details">
                        <b>Task #${data.id}</b>
                        <p>${data.description}</p>
                    </div>
                    <div class="action">
                        <img src="./public/images/ICON_EDIT.png" alt="edit icon" id="edit-${data.id}">
                        <img src="./public/images/ICON_SAVE.png" alt="save icon" class="hidden" id="save-${data.id}">
                        <img src="./public/images//ICON_DELETE.png" alt="delete icon" id="delete-${data.id}">
                    </div>   
                `;
            } else if (column === 'progress') {
                card.innerHTML = `
                    <div class="details">
                        <p>Task #${data.id}</p>
                        <p>${data.description}</p>
    
                        <b>Start time</b>
                        <p>${formateDate(data.startTime)}</p> 
    
                        <b>Responsible</b>
                        <p>${data.responsible}</p>
    
                    </div>
                    <div class="action">
                        <img src="./public/images/ICON_EDIT.png" alt="edit icon" id="edit-${data.id}">
                        <img src="./public/images/ICON_SAVE.png" alt="save icon" class="hidden" id="save-${data.id}">
                        <img src="./public/images/ICON_END.png" alt="end icon">
                    </div>   
                `; 
            } else if (column === 'done') {
                card.innerHTML = `
                <div class="details">
                    <p>Task #${data.id}</p>
                    <p>${data.description}</p>
    
                    <b>Start time</b>
                    <p>${formateDate(data.startTime)}</p> 
    
                    <b>End time</b>
                    <p>${formateDate(data.endTime)}</p> 
    
                    <b>Responsible</b>
                    <p>${data.responsible}</p>
    
                </div>
                <div class="action">
                <img src="./public/images//ICON_EDIT.png" alt="edit icon" id="edit-${data.id}">
                    <img src="./public/images/ICON_SAVE.png" alt="save icon" class="hidden" id="save-${data.id}">
                    <img src="./public/images/ICON_DELETE.png" alt="delete icon">
                </div>   
            `;
            }

        } else if (mode === 'write') {

            if (column === 'backlog') {
                card.innerHTML = `
                    <div class="details">
                        <b>Task #${data.id}</b>
                        <p>${data.description}</p>
                    </div>
                    <div class="action">
                        <img src="./public/images/ICON_EDIT.png" alt="edit icon" id="edit-${data.id}">
                        <img src="./public/images/ICON_SAVE.png" alt="save icon" class="hidden" id="save-${data.id}">
                        <img src="./public/images//ICON_DELETE.png" alt="delete icon" id="delete-${data.id}">
                    </div>   
                `;
            } else if (column === 'progress') {
                card.innerHTML = `
                    <div class="details">
                        <p>Task #${data.id}</p>
                        <p>${data.description}</p>

                        <b>Start time</b>
                        <input type="text" id="${data.id}-startTime">

                        <b>Responsible</b>
                        <input type="text" id="${data.id}-responsible">
    
                    </div>
                    <div class="action">
                        <img src="./public/images/ICON_EDIT.png" alt="edit icon" class="hidden" id="edit-${data.id}">
                        <img src="./public/images/ICON_SAVE.png" alt="save icon" id="save-${data.id}">
                        <img src="./public/images/ICON_END.png" alt="end icon">
                    </div>   
                `; 
            } else if (column === 'done') {
                card.innerHTML = `
                <div class="details">
                    <p>Task #${data.id}</p>
                    <p>${data.description}</p>
    
                    <b>Start time</b>
                    <p>${formateDate(data.startTime)}</p> 
    
                    <b>End time</b>
                    <input type="text" id="${data.id}-endTime">
    
                    <b>Responsible</b>
                    <p>${data.responsible}</p>
    
                </div>
                <div class="action">
                <img src="./public/images//ICON_EDIT.png" alt="edit icon" id="edit-${data.id}">
                    <img src="./public/images/ICON_SAVE.png" alt="save icon" class="hidden" id="save-${data.id}">
                    <img src="./public/images/ICON_DELETE.png" alt="delete icon">
                </div>   
            `;
            }
            
        }

        document.getElementById(column).appendChild(card);
        document.getElementById(data.id).addEventListener('dragstart', this.dragStart);
        document.getElementById(`delete-${data.id}`)?.addEventListener('click', () => this.delete(data.id, column));
        document.getElementById(`edit-${data.id}`)?.addEventListener('click', () => this.edit(data.id, column))
        document.getElementById(`save-${data.id}`)?.addEventListener('click', () => this.save(data.id, column))
    }

    save = (id, column) => {

        const card = document.getElementById(id);
        const task = DB.getTask(id, column);
        
        // Get input value
        const input = this.getDetails(id, column)
        if (input) {

            card.setAttribute('draggable', 'true');
            card.classList.toggle('edit');
            document.getElementById(`edit-${id}`).classList.toggle('hidden');
            document.getElementById(`save-${id}`).classList.toggle('hidden')

            // Merge data
            const updatedObj = { ...task, ...input };
            
            // Update value in DB
            DB.replace(updatedObj, column);

            // Convert back input to p
            if (column === 'backlog') {

                document.getElementById(id).getElementsByClassName('details')[0].innerHTML = `
                    <b>Task #${task.id}</b>
                    <p>${updatedObj.description}</p>
                `;
                
            } else if (column === 'progress') {

                document.getElementById(id).getElementsByClassName('details')[0].innerHTML = `
                    <p>Task #${task.id}</p>
                    <p>${updatedObj.description}</p>

                    <b>Start time</b>
                    <p>${formateDate(updatedObj.startTime)}</p> 

                    <b>Responsible</b>
                    <p>${updatedObj.responsible}</p>
                `;

            } else if (column === 'done') {

                document.getElementById(id).getElementsByClassName('details')[0].innerHTML = `
                    <p>Task #${task.id}</p>
                    <p>${updatedObj.description}</p>

                    <b>Start time</b>
                    <p>${formateDate(updatedObj.startTime)}</p> 

                    <b>Responsible</b>
                    <p>${updatedObj.responsible}</p>

                    <b>End time</b>
                    <p>${formateDate(updatedObj.endTime)}</p> 
                `;

            }

        }
    }

    edit = (id, column) => {

        const card = document.getElementById(id);
        card.classList.toggle('edit');

        const task = DB.getTask(id, column);
        card.setAttribute('draggable', 'false');
        document.getElementById(`edit-${id}`).classList.toggle('hidden');
        document.getElementById(`save-${id}`).classList.toggle('hidden')

        // p to input
        if (column === 'backlog') {
            document.getElementById(id).getElementsByClassName('details')[0].innerHTML = `
                <b>Task #${task.id}</b>
                <input type="text" id="${id}-description" value="${task.description}">
            `;
        } else if (column === 'progress') {
            document.getElementById(id).getElementsByClassName('details')[0].innerHTML = `
                <b>Task #${task.id}</b>
                <input type="text" id="${id}-description" value="${task.description}">

                <b>Start time</b>
                <input type="text" id="${id}-startTime" value="${task.startTime}">

                <b>Responsible</b>
                <input type="text" id="${id}-responsible" value="${task.responsible}">
            `;
        } else if (column === 'done') {
            document.getElementById(id).getElementsByClassName('details')[0].innerHTML = `
                <b>Task #${task.id}</b>
                <input type="text" id="${id}-description" value="${task.description}">

                <b>Start time</b>
                <input type="text" id="${id}-startTime" value="${task.startTime}">

                <b>End time</b>
                <input type="text" id="${id}-endTime" value="${task.endTime}">

                <b>Responsible</b>
                <input type="text" id="${id}-responsible" value="${task.responsible}">
            `;
        }

    }

    delete = (id, column) => {
        if (column === 'progress') return alert('Cannot delete task in progress!');

        if (confirm('Confirm deletetion?')) {
            document.getElementById(id).remove();
            DB.delete(id, column);
        }
    }

    dragStart = (event) => {
        event.dataTransfer.setData('text', event.target.id);
    }

    getDetails (id, column) {

        const input = {};
        let error = false;

        if (column === 'backlog') {

            input.description = this.validateInput(document.getElementById(`${id}-description`));
            if (!input.description) error = true;

        } else if (column === 'progress') {

            input.startTime = this.validateInput(document.getElementById(`${id}-startTime`));
            input.responsible = this.validateInput(document.getElementById(`${id}-responsible`));
            if (!input.startTime || !input.responsible) error = true;

        } else if (column === 'done') {

            input.endTime = this.validateInput(document.getElementById(`${id}-endTime`));
            if (!input.endTime) error = true;

        }

        return error ? false : input;
    }

    validateInput = (element) => {
        if (!element.value) {
            element.classList.add('error');
            return false;
        }

        return element.value
    }
}

class Manager {

    constructor () {
        if (!DB.task) return alert('Faile   d to connect local storage');
        
        // Submit Add Task
        document.getElementById('add-task').addEventListener('click', this.addTask);

        document.getElementById('backlog').addEventListener('drop', (event) => this.drop(event, 'backlog'))
        document.getElementById('backlog').addEventListener('dragover', (event) => this.dragOver(event, 'backlog'))

        document.getElementById('progress').addEventListener('drop', (event) => this.drop(event, 'progress'))
        document.getElementById('progress').addEventListener('dragover', (event) => this.dragOver(event, 'progress'))

        document.getElementById('done').addEventListener('drop', (event) => this.drop(event, 'done'))
        document.getElementById('done').addEventListener('dragover', (event) => this.dragOver(event, 'done'))

        document.getElementById('backlog').addEventListener("dragend", event => this.dragEnd());

        // Load data to UI
        this.populate(DB.task);
    }

    dragEnd = () => {
        document.getElementById('backlog').style.background = 'none'   
        document.getElementById('progress').style.background = 'none'   
        document.getElementById('done').style.background = 'none'      
    }

    dragOver = (event, hoveredColumn) => {
        console.log(event.dataTransfer.getData('text'))
        const id = event.dataTransfer.getData('text');
        const currentColumn = document.getElementById(id).parentElement.id;

        if (currentColumn === 'backlog' && hoveredColumn === 'progress') event.preventDefault();
        else if (currentColumn === 'done' && hoveredColumn === 'progress') event.preventDefault();
        else if (currentColumn === 'progress' && (hoveredColumn === 'backlog' || hoveredColumn === 'done')) event.preventDefault();
        else if (currentColumn === hoveredColumn) event.preventDefault();

        if (currentColumn === 'backlog' && hoveredColumn === 'done') {
            // show errror
            document.getElementById(hoveredColumn).style.background = 'red'
        } else {
            document.getElementById('backlog').style.background = 'none'   
            document.getElementById('progress').style.background = 'none'   
            document.getElementById('done').style.background = 'none'   
        }
    }

    drop = (event, newColumn) => {
        event.preventDefault();

        const id = event.dataTransfer.getData('text');
        const previousColumn = document.getElementById(id).parentElement.id;

        const prop = DB.getTask(id, previousColumn);

        document.getElementById(id).remove();
        DB.update(prop, newColumn, previousColumn)

        new Card(newColumn, prop, 'write')
    }

    addTask = () => {
        const description = document.getElementById('add-task-description');
        if (!description.value) return alert('Missing description!');

        const task = {
            id: DB.getIndex(),
            description: description.value
        }

        DB.save(task);
        new Card('backlog', task);
    }

    populate = (tasks) => {
        const { backlog, progress, done } = tasks;
        
        backlog.forEach(i => new Card('backlog', i)) ;
        progress.forEach(i => new Card('progress', i)); 
        done.forEach(i => new Card('done', i));
    }

}

const DB = new Storage();
const app = new Manager();