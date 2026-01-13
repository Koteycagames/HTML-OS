import { auth, db } from './config.js';
import { playTone } from './sound.js';
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Список программ
export const apps = [
    { name: "Компьютер", icon: "💻", type: "sys" },
    { name: "Проводник", icon: "📂", type: "explorer" }, // Новое
    { name: "Магазин", icon: "🛍️", type: "store" },      // Новое
    { name: "Браузер", icon: "🌐", type: "browser" },
    { name: "Блокнот", icon: "📝", type: "notepad" },
    { name: "Калькулятор", icon: "🧮", type: "calc" },
    { name: "Терминал", icon: "⌨️", type: "cmd" },
    { name: "Настройки", icon: "⚙️", type: "settings" }
];

// Генерация HTML содержимого
export function getAppContent(type, id) {
    if (type === 'explorer') {
        return `<div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;color:#666;">
            <div style="font-size:50px;">🔨</div>
            <h3>В разработке</h3>
            <p>Проводник файлов скоро появится.</p>
        </div>`;
    }
    if (type === 'store') {
        return `<div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;color:#666;">
            <div style="font-size:50px;">🛍️</div>
            <h3>Компоненты ОС</h3>
            <p>Магазин приложений в разработке.</p>
        </div>`;
    }
    if (type === 'notepad') {
        const saved = localStorage.getItem('note_save') || '';
        return `
        <div class="notepad-wrapper">
            <div class="notepad-menu">
                <button class="btn-action" id="save-${id}">Сохранить</button>
            </div>
            <textarea id="note-${id}" class="notepad-area">${saved}</textarea>
        </div>`;
    } 
    else if (type === 'cmd') {
        return `
        <div class="cmd-wrapper">
            <div class="cmd-output" id="cmd-out-${id}">HTML OS [Version 5.1]<br>(c) 2026 Corporation.<br>Введите 'help' для списка команд.<br><br></div>
            <div class="cmd-input-line">
                <span>C:\\User></span>
                <input type="text" class="cmd-input" id="cmd-in-${id}" autocomplete="off">
            </div>
        </div>`;
    }
    else if (type === 'settings') {
        // Обои побольше
        const wps = [
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000",
            "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=1000",
            "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=1000",
            "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1000",
            "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1000"
        ];
        let wpHTML = '';
        wps.forEach(url => {
            wpHTML += `<div class="wallpaper-thumb" style="background-image:url('${url}')" data-wp="${url}"></div>`;
        });

        return `
        <div class="settings-container">
            <div class="settings-sidebar">
                <div class="set-tab active" data-tab="sys" id="tab-sys-${id}">Система</div>
                <div class="set-tab" data-tab="pers" id="tab-pers-${id}">Обои</div>
                <div class="set-tab" data-tab="snd" id="tab-snd-${id}">Звук</div>
            </div>
            <div class="settings-content">
                <div class="set-section active" id="sec-sys-${id}">
                    <h4>Система</h4>
                    <p>HTML OS Modular 5.1</p>
                    <p>Пользователь: ${auth.currentUser ? auth.currentUser.email : 'Guest'}</p>
                </div>
                <div class="set-section" id="sec-pers-${id}">
                    <h4>Выберите фон:</h4>
                    <div class="wallpaper-grid">
                        ${wpHTML}
                    </div>
                </div>
                <div class="set-section" id="sec-snd-${id}">
                    <h4>Звук</h4>
                    <p>Громкость:</p>
                    <input type="range" min="0" max="1" step="0.1" id="vol-${id}">
                    <p><input type="checkbox" id="snd-check-${id}"> Звуки интерфейса</p>
                    <button class="btn-action" id="test-snd-${id}">Тест звука</button>
                </div>
            </div>
        </div>`;
    }
    else if (type === 'browser') {
        return `
        <div class="browser-wrapper">
            <div class="browser-bar">
                <button id="home-${id}" title="Домой">🏠</button>
                <input type="text" id="url-${id}" value="home.html" placeholder="Введите адрес сайта">
                <button class="btn-action" id="go-${id}">Go</button>
            </div>
            <div id="browser-content-${id}" class="browser-content">
                <div class="loader-wrap"><div class="loader"></div></div>
            </div>
        </div>`;
    }
    else if (type === 'calc') {
        return `
        <div class="calc-grid">
            <div class="calc-display">0</div>
            <button class="calc-btn">C</button><button class="calc-btn">/</button><button class="calc-btn">*</button><button class="calc-btn">DEL</button>
            <button class="calc-btn">7</button><button class="calc-btn">8</button><button class="calc-btn">9</button><button class="calc-btn">-</button>
            <button class="calc-btn">4</button><button class="calc-btn">5</button><button class="calc-btn">6</button><button class="calc-btn">+</button>
            <button class="calc-btn">1</button><button class="calc-btn">2</button><button class="calc-btn">3</button><button class="calc-btn equal">=</button>
            <button class="calc-btn" style="grid-column: span 2">0</button><button class="calc-btn">.</button>
        </div>`;
    }
    return `<div>Приложение ${type}</div>`;
}

// ЛОГИКА ПРИЛОЖЕНИЙ
export function initAppLogic(type, id, winElement) {
    if (type === 'notepad') {
        winElement.querySelector(`#save-${id}`).onclick = () => {
            localStorage.setItem('note_save', winElement.querySelector(`#note-${id}`).value);
            alert('Сохранено');
        };
    }
    else if (type === 'cmd') {
        const input = winElement.querySelector(`#cmd-in-${id}`);
        const out = winElement.querySelector(`#cmd-out-${id}`);
        winElement.onclick = () => input.focus();

        input.onkeydown = (e) => {
            if(e.key === 'Enter') {
                const val = input.value.trim().toLowerCase();
                out.innerHTML += `<div>C:\\User> ${input.value}</div>`;
                
                if (val === 'help') out.innerHTML += `<div>Команды: help, dir, cls, echo, color, exit, date</div>`;
                else if (val === 'dir') out.innerHTML += `<div><br> Directory of C:\\User<br><br>26.12.2025  DIR  Documents<br>26.12.2025  DIR  Downloads<br>26.12.2025  FILE secret.txt<br></div>`;
                else if (val === 'cls') out.innerHTML = '';
                else if (val.startsWith('echo ')) out.innerHTML += `<div>${val.substring(5)}</div>`;
                else if (val === 'date') out.innerHTML += `<div>${new Date().toLocaleString()}</div>`;
                else if (val === 'exit') winElement.querySelector('.close-btn').click();
                else if (val.startsWith('color ')) {
                    const color = val.split(' ')[1];
                    out.style.color = color;
                    input.style.color = color;
                }
                else if (val) out.innerHTML += `<div style="color:red">Error: Command not found.</div>`;

                input.value = '';
                out.scrollTop = out.scrollHeight;
            }
        };
    }
    else if (type === 'settings') {
        // Табы
        const tabs = winElement.querySelectorAll('.set-tab');
        tabs.forEach(tab => {
            tab.onclick = () => {
                winElement.querySelectorAll('.set-tab').forEach(t => t.classList.remove('active'));
                winElement.querySelectorAll('.set-section').forEach(s => s.classList.remove('active'));
                tab.classList.add('active');
                winElement.querySelector('#sec-' + tab.dataset.tab + '-' + id).classList.add('active');
            };
        });
        // Обои
        winElement.querySelectorAll('.wallpaper-thumb').forEach(wp => {
            wp.onclick = () => {
                localStorage.setItem('os_wallpaper', wp.dataset.wp);
                document.getElementById('desktop').style.backgroundImage = `url('${wp.dataset.wp}')`;
            };
        });
        // Звук
        const vol = winElement.querySelector(`#vol-${id}`);
        const check = winElement.querySelector(`#snd-check-${id}`);
        vol.value = localStorage.getItem('os_volume') || 0.5;
        check.checked = localStorage.getItem('os_sound_enabled') === 'true';

        vol.oninput = () => localStorage.setItem('os_volume', vol.value);
        check.onchange = () => localStorage.setItem('os_sound_enabled', check.checked);
        winElement.querySelector(`#test-snd-${id}`).onclick = () => playTone(440, 0.5);
    }
    else if (type === 'calc') {
        const disp = winElement.querySelector('.calc-display');
        winElement.querySelectorAll('.calc-btn').forEach(btn => {
            btn.onclick = () => {
                const v = btn.innerText;
                if(v === 'C') disp.innerText = '0';
                else if(v === 'DEL') disp.innerText = disp.innerText.slice(0,-1) || '0';
                else if(v === '=') { try { disp.innerText = eval(disp.innerText); } catch{ disp.innerText='Err'; } }
                else { disp.innerText = (disp.innerText === '0' ? '' : disp.innerText) + v; }
            };
        });
    }
    else if (type === 'browser') {
        const input = winElement.querySelector(`#url-${id}`);
        const contentDiv = winElement.querySelector(`#browser-content-${id}`);
        const goBtn = winElement.querySelector(`#go-${id}`);
        const homeBtn = winElement.querySelector(`#home-${id}`);

        // Функция рендеринга страниц
        const loadPage = async (url) => {
            contentDiv.innerHTML = '<div style="padding:20px;">Загрузка...</div>';
            
            try {
                // Главная страница
                if (url === 'home.html' || url === 'home') {
                    contentDiv.innerHTML = `
                        <div style="padding:40px; text-align:center;">
                            <h1>🌐 HTML Edge</h1>
                            <div style="display:flex; gap:20px; justify-content:center; margin-top:30px;">
                                <div class="site-card" data-link="premium.com" style="background:#ffd700; color:black;">
                                    <h3>💎 Premium</h3>
                                    <p>Купить статус</p>
                                </div>
                                <div class="site-card" data-link="htmlbank.com" style="background:#00d8ff; color:white;">
                                    <h3>🇺🇦 HTML Bank</h3>
                                    <p>Твои UAH</p>
                                </div>
                                <div class="site-card" data-link="bank.com" style="background:#2ecc71; color:white;">
                                    <h3>💵 Virtual Bank</h3>
                                    <p>Виртуальные $</p>
                                </div>
                            </div>
                        </div>`;
                }
                // Сайт Premium
                else if (url === 'premium.com') {
                    const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
                    const data = docSnap.data();
                    const isPremium = data && data.premium === true;

                    contentDiv.innerHTML = `
                        <div style="padding:40px; text-align:center; background:#111; color:#ffd700; height:100%;">
                            <h1 style="font-size:40px;">👑 PREMIUM OS</h1>
                            <div style="margin:30px 0; font-size:24px;">
                                Статус: ${isPremium ? '<span style="color:#0f0">АКТИВЕН ✅</span>' : '<span style="color:#f00">НЕ АКТИВЕН ❌</span>'}
                            </div>
                            <p>Премиум дает доступ к экспериментальным функциям.</p>
                            <p style="font-size:18px;">Цена: <b>80 грн / неделя</b></p>
                            <button style="padding:15px 30px; font-size:18px; background:#ffd700; border:none; border-radius:10px; cursor:pointer; margin-top:20px;">
                                ${isPremium ? 'Продлить подписку' : 'Купить Premium'}
                            </button>
                            <p style="font-size:12px; color:#666; margin-top:20px;">Оплата администратору вручную.</p>
                        </div>`;
                }
                // Сайт HTML Bank (UAH)
                else if (url === 'htmlbank.com') {
                    const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
                    const data = docSnap.data();
                    const balance = data ? data.UAH : 0;

                    contentDiv.innerHTML = `
                        <div style="padding:30px; background: linear-gradient(135deg, #004e92, #000428); height:100%; color:white;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <h2>🇺🇦 HTML Bank</h2>
                                <span>${auth.currentUser.email}</span>
                            </div>
                            <div style="background:rgba(255,255,255,0.1); padding:30px; border-radius:20px; margin-top:40px; text-align:center;">
                                <p style="font-size:18px; opacity:0.7;">Баланс счета</p>
                                <h1 style="font-size:50px; margin:10px 0;">${balance} ₴</h1>
                                <p style="font-size:12px; color:#aaa;">UAH - Реальная валюта</p>
                            </div>
                            <div style="margin-top:20px; font-size:14px; color:#ccc;">
                                * Средства начисляются администратором после перевода.
                            </div>
                        </div>`;
                }
                // Сайт Virtual Bank ($)
                else if (url === 'bank.com') {
                    const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
                    const data = docSnap.data();
                    const money = data ? data.money : 0;

                    contentDiv.innerHTML = `
                        <div style="padding:30px; background:#f0f2f5; height:100%; color:#333;">
                            <h2 style="color:#2c3e50;">🏦 Virtual Bank</h2>
                            <div style="background:linear-gradient(90deg, #11998e, #38ef7d); padding:20px; border-radius:15px; color:white; margin-top:20px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                                <p>Виртуальная карта</p>
                                <h1 style="font-size:40px; margin:10px 0;">$ ${money.toFixed(2)}</h1>
                                <p>**** **** **** 1234</p>
                            </div>
                            <div style="margin-top:20px;">
                                <h3>История операций</h3>
                                <div style="padding:10px; background:white; border-radius:10px; margin-top:10px;">
                                    <div style="display:flex; justify-content:space-between;">
                                        <span>Бонус регистрации</span>
                                        <span style="color:green;">+100.00 $</span>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                }
                else {
                    contentDiv.innerHTML = `<div style="text-align:center; padding:50px;">
                        <h1>404</h1><p>Сайт <b>${url}</b> не найден в сети HTML OS.</p>
                    </div>`;
                }
            } catch (e) {
                contentDiv.innerHTML = `<div style="color:red; padding:20px;">Ошибка загрузки данных: ${e.message}</div>`;
            }

            // Добавляем клики по ссылкам (карточкам)
            const links = contentDiv.querySelectorAll('.site-card');
            links.forEach(card => {
                card.style.cursor = 'pointer';
                card.onclick = () => {
                    input.value = card.dataset.link;
                    loadPage(card.dataset.link);
                };
            });
        };

        // События браузера
        goBtn.onclick = () => loadPage(input.value);
        homeBtn.onclick = () => { input.value = 'home.html'; loadPage('home.html'); };
        input.onkeydown = (e) => { if(e.key === 'Enter') loadPage(input.value); };

        // Загрузка главной при старте
        loadPage('home.html');
    }
}
