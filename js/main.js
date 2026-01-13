import { auth, db } from './config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { playSystemSound } from './sound.js';
import { apps } from './apps.js';
import { openWindow } from './wm.js';

// --- ИНИЦИАЛИЗАЦИЯ ---
document.addEventListener('DOMContentLoaded', () => {
    // Обои
    const defaultWp = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop';
    const savedWp = localStorage.getItem('os_wallpaper') || defaultWp;
    document.getElementById('desktop').style.backgroundImage = `url('${savedWp}')`;
    
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

// --- АВТОРИЗАЦИЯ И СОЗДАНИЕ ДАННЫХ ---
let isRegistering = false;
const authBtn = document.getElementById('auth-btn');
const toggleAuth = document.getElementById('toggle-auth');
const errorMsg = document.getElementById('error-msg');

toggleAuth.addEventListener('click', () => {
    isRegistering = !isRegistering;
    document.getElementById('auth-title').innerText = isRegistering ? "Регистрация" : "Вход";
    authBtn.innerText = isRegistering ? "Создать аккаунт" : "Войти";
    toggleAuth.innerText = isRegistering ? "Уже есть аккаунт?" : "Нет аккаунта?";
});

// Функция создания данных пользователя (если их нет)
async function ensureUserData(user, email) {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
        console.log("Данные отсутствуют. Создаем новый профиль...");
        await setDoc(userRef, {
            email: email,
            UAH: 0,       // Гривны
            money: 10,    // Доллары (УМЕНЬШИЛ БОНУС ДО 10)
            premium: false
        });
    }
}

authBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    playSystemSound('click');
    errorMsg.innerText = "Обработка...";

    try {
        let userCred;
        if (isRegistering) {
            // 1. РЕГИСТРАЦИЯ
            userCred = await createUserWithEmailAndPassword(auth, email, pass);
            // Сразу создаем данные
            await ensureUserData(userCred.user, email);
        } else {
            // 2. ВХОД
            userCred = await signInWithEmailAndPassword(auth, email, pass);
            // ПРОВЕРЯЕМ: Если аккаунт старый и данных нет -> создаем их сейчас
            await ensureUserData(userCred.user, email);
        }
        
        loadDesktop();
    } catch (err) {
        playSystemSound('error');
        errorMsg.innerText = "Ошибка: " + err.code;
        console.error(err);
    }
});

function loadDesktop() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('desktop').style.display = 'block';
    playSystemSound('login');
}

// --- ОТРИСОВКА ---
function renderIcons() {
    const area = document.getElementById('icon-area');
    area.innerHTML = '';
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
    list.innerHTML = '';
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

// --- UI ---
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
