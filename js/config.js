import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC-BFchwayl_dKAYjsHj7-POruxRpXMgK0",
    authDomain: "html-os-8e366.firebaseapp.com",
    projectId: "html-os-8e366",
    storageBucket: "html-os-8e366.firebasestorage.app",
    messagingSenderId: "221340160374",
    appId: "1:221340160374:web:13ca90ad3b97f2c2876a57"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);