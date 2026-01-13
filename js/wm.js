import { getAppContent, initAppLogic } from './apps.js';
import { playSystemSound } from './sound.js';

let zIndex = 100;

export function openWindow(app) {
    playSystemSound('open');
    const id = 'win-' + Date.now();
    const win = document.createElement('div');
    win.className = 'window';
    win.id = id;
    
    // Начальная позиция
    win.style.left = (50 + Math.random() * 50) + 'px';
    win.style.top = (50 + Math.random() * 50) + 'px';
    win.style.zIndex = ++zIndex;

    // Спец размеры
    if(app.type === 'calc') { win.style.width = '300px'; win.style.height = '420px'; }
    if(app.type === 'settings') { win.style.width = '600px'; win.style.height = '400px'; }

    const contentHtml = getAppContent(app.type, id);

    win.innerHTML = `
        <div class="title-bar">
            <div class="title-drag-area">${app.icon} ${app.name}</div>
            <div class="window-controls">
                <button class="win-btn minimize-btn">_</button>
                <button class="win-btn close-btn">✕</button>
            </div>
        </div>
        <div class="window-content">${contentHtml}</div>
    `;

    document.getElementById('desktop').appendChild(win);
    
    // Логика окна
    win.querySelector('.close-btn').onclick = () => { win.remove(); document.getElementById('task-'+id)?.remove(); playSystemSound('click'); };
    win.querySelector('.minimize-btn').onclick = () => { win.style.display='none'; document.getElementById('task-'+id).classList.remove('active-task'); };
    win.onmousedown = () => focusWindow(id);

    // Добавляем таскбар
    addTaskbarItem(id, app.name);
    // Делаем перетаскиваемым
    makeDraggable(win, id);
    // Инициализируем JS приложения
    initAppLogic(app.type, id, win);
}

export function focusWindow(id) {
    const w = document.getElementById(id);
    if (!w) return;
    if (w.style.display === 'none') w.style.display = 'flex';
    w.style.zIndex = ++zIndex;
    document.querySelectorAll('.task-item').forEach(t => t.classList.remove('active-task'));
    const t = document.getElementById('task-'+id);
    if(t) t.classList.add('active-task');
}

function addTaskbarItem(id, name) {
    const bar = document.getElementById('taskbar-list');
    const t = document.createElement('div');
    t.className = 'task-item active-task';
    t.id = 'task-'+id;
    t.innerText = name;
    t.onclick = () => focusWindow(id);
    bar.appendChild(t);
}

function makeDraggable(el, id) {
    const head = el.querySelector('.title-drag-area');
    let pos1=0, pos2=0, pos3=0, pos4=0;
    
    head.onmousedown = (e) => {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDrag;
        document.onmousemove = elementDrag;
        focusWindow(id);
    };

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
    }

    function closeDrag() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}