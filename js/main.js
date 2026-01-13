import { auth } from './config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { playSystemSound } from './sound.js';
import { apps } from './apps.js';
import { openWindow } from './wm.js';

// --- ИНИЦИАЛИЗАЦИЯ ---
document.addEventListener('DOMContentLoaded', () => {
    // Восстановление обоев
    const savedWp = localStorage.getItem('os_wallpaper');
    if(savedWp) document.getElementById('desktop').style.backgroundImage = `url('${savedWp}')`;
    
    // Часы
    setInterval(() => {
        const d = new Date();
        document.getElementById('clock').innerText = d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    }, 1000);

    renderIcons();
    renderStartMenu();
});

// --- СИСТЕМА ЭКРАНОВ ---
const powerBtn = document.getElementById('btn-power');
powerBtn.addEventListener('click', () => {
    document.getElementById('launch-screen').classList.remove('active');
    document.getElementById('boot-screen').classList.add('active');
    setTimeout(() => {
        document.getElementById('boot-screen').classList.remove('active');
        onAuthStateChanged(auth, (user) => {
            if (user) loadDesktop();
            else document.getElementById('login-screen').classList.add('active');
        });
    }, 2000);
});

// --- АВТОРИЗАЦИЯ ---
let isRegistering = false;
const authBtn = document.getElementById('auth-btn');
const toggleAuth = document.getElementById('toggle-auth');
const errorMsg = document.getElementById('error-msg');

toggleAuth.addEventListener('click', () => {
    isRegistering = !isRegistering;
    document.getElementById('auth-title').innerText = isRegistering ? "Регистрация" : "Вход";
    authBtn.innerText = isRegistering ? "Создать" : "Войти";
    toggleAuth.innerText = isRegistering ? "Есть аккаунт?" : "Нет аккаунта?";
});

authBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    playSystemSound('click');
    errorMsg.innerText = "Загрузка...";

    const method = isRegistering ? createUserWithEmailAndPassword : signInWithEmailAndPassword;
    method(auth, email, pass)
        .then(() => loadDesktop())
        .catch(err => {
            playSystemSound('error');
            errorMsg.innerText = err.code;
        });
});

function loadDesktop() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('desktop').style.display = 'block';
    playSystemSound('login');
}

// --- ОТРИСОВКА ИНТЕРФЕЙСА ---
function renderIcons() {
    const area = document.getElementById('icon-area');
    apps.forEach(app => {
        const el = document.createElement('div');
        el.className = 'desktop-icon';
        el.innerHTML = `<div class="icon-img">${app.icon}</div><div class="icon-text">${app.name}</div>`;
        el.ondblclick = () => openWindow(app);
        area.appendChild(el);
    });
}

function renderStartMenu() {
    const list = document.getElementById('start-list');
    apps.forEach(app => {
        const item = document.createElement('div');
        item.className = 'menu-item';
        item.innerHTML = `${app.icon} <span>${app.name}</span>`;
        item.onclick = () => {
            openWindow(app);
            document.getElementById('start-menu').style.display = 'none';
        };
        list.appendChild(item);
    });
}

// --- УПРАВЛЕНИЕ UI ---
document.getElementById('btn-start-menu').onclick = () => {
    const m = document.getElementById('start-menu');
    m.style.display = m.style.display === 'flex' ? 'none' : 'flex';
};

document.getElementById('btn-shutdown').onclick = () => {
    document.getElementById('shutdown-screen').classList.add('active');
    playSystemSound('shutdown');
    setTimeout(() => { signOut(auth).then(()=>location.reload()); }, 3000);
};
document.getElementById('btn-lock').onclick = () => signOut(auth).then(()=>location.reload());