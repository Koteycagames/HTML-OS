import { auth } from './config.js';
import { playTone } from './sound.js';

export const apps = [
    { name: "Компьютер", icon: "💻", type: "sys" },
    { name: "Блокнот", icon: "📝", type: "notepad" },
    { name: "Калькулятор", icon: "🧮", type: "calc" },
    { name: "HTML Edge", icon: "🌍", type: "browser" },
    { name: "Терминал", icon: "⌨️", type: "cmd" },
    { name: "Настройки", icon: "⚙️", type: "settings" }
];

export function getAppContent(type, id) {
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
    else if (type === 'settings') {
        return `
        <div class="settings-container">
            <div class="settings-sidebar">
                <div class="set-tab active" data-tab="sys" id="tab-sys-${id}">Система</div>
                <div class="set-tab" data-tab="pers" id="tab-pers-${id}">Оформление</div>
                <div class="set-tab" data-tab="snd" id="tab-snd-${id}">Звук</div>
            </div>
            <div class="settings-content">
                <div class="set-section active" id="sec-sys-${id}">
                    <h4>Система</h4>
                    <p>HTML OS Modular 5.0</p>
                    <p>Пользователь: ${auth.currentUser ? auth.currentUser.email : 'Guest'}</p>
                </div>
                <div class="set-section" id="sec-pers-${id}">
                    <h4>Обои</h4>
                    <div class="wallpaper-grid">
                        <div class="wallpaper-thumb" style="background-image:url('https://images.unsplash.com/photo-1477346611705-65d1883cee1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300')" data-wp="https://images.unsplash.com/photo-1477346611705-65d1883cee1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950"></div>
                        <div class="wallpaper-thumb" style="background-image:url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300')" data-wp="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950"></div>
                        <div class="wallpaper-thumb" style="background-image:url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=300')" data-wp="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950"></div>
                    </div>
                </div>
                <div class="set-section" id="sec-snd-${id}">
                    <h4>Звук</h4>
                    <p>Громкость:</p>
                    <input type="range" min="0" max="1" step="0.1" id="vol-${id}">
                    <p>Включить звуки: <input type="checkbox" id="snd-check-${id}"></p>
                    <button class="btn-action" id="test-snd-${id}">Тест звука</button>
                </div>
            </div>
        </div>`;
    }
    else if (type === 'browser') {
        return `<iframe style="width:100%;height:100%;border:none;" src="https://ru.wikipedia.org/wiki/Special:Random"></iframe>`;
    }
    return `<div>Приложение ${type}</div>`;
}

export function initAppLogic(type, id, winElement) {
    if (type === 'notepad') {
        winElement.querySelector(`#save-${id}`).onclick = () => {
            localStorage.setItem('note_save', winElement.querySelector(`#note-${id}`).value);
            alert('Сохранено');
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
}