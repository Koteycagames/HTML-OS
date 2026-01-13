let systemSoundEnabled = localStorage.getItem('os_sound_enabled') === 'true';
let systemVolume = localStorage.getItem('os_volume') || 0.5;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export function playTone(freq, duration, type = 'sine') {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    gain.gain.setValueAtTime(parseFloat(systemVolume), audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

export function playSystemSound(type) {
    // Обновляем настройки каждый раз (или можно сделать подписку)
    systemSoundEnabled = localStorage.getItem('os_sound_enabled') === 'true';
    systemVolume = localStorage.getItem('os_volume') || 0.5;

    if (!systemSoundEnabled) return;
    if (type === 'open') playTone(600, 0.1);
    if (type === 'error') playTone(150, 0.3, 'sawtooth');
    if (type === 'click') playTone(800, 0.05);
    if (type === 'shutdown') playTone(200, 1.0);
    if (type === 'login') playTone(400, 0.5);
}