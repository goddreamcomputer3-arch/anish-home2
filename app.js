import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCsH70pG6m27vOHacTxu7aw9dJKofg-qzw",
  authDomain: "led-control-5659c.firebaseapp.com",
  databaseURL: "https://led-control-5659c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "led-control-5659c",
  storageBucket: "led-control-5659c.firebasestorage.app",
  messagingSenderId: "682284168842",
  appId: "1:682284168842:web:cd7d3bab8168a4210f1f73"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);
const dbPath = "board1/outputs/digital";

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Helper to update the UI button colors
function updateUI(pin, value) {
    const btn = document.getElementById("btn" + pin);
    const status = document.getElementById("status" + pin);
    if (value === 1) {
        btn.classList.add("on");
        status.innerText = "Status: ON";
    } else {
        btn.classList.remove("on");
        status.innerText = "Status: OFF";
    }
}

// Logic for clicking buttons
[2, 21, 22].forEach(pin => {
    const btn = document.getElementById("btn" + pin);
    btn.onclick = () => {
        const isNowOn = btn.classList.contains("on");
        set(ref(db, `${dbPath}/${pin}`), isNowOn ? 0 : 1);
    };

    // Watch for changes in Firebase
    onValue(ref(db, `${dbPath}/${pin}`), (snapshot) => {
        updateUI(pin, snapshot.val());
    });
});

// Auth Logic
loginBtn.onclick = () => {
    const email = document.getElementById("emailField").value;
    const pass = document.getElementById("passwordField").value;
    signInWithEmailAndPassword(auth, email, pass).catch(err => alert(err.message));
};

logoutBtn.onclick = () => signOut(auth);

onAuthStateChanged(auth, (user) => {
    document.getElementById("authBox").style.display = user ? "none" : "block";
    document.getElementById("controlBox").style.display = user ? "block" : "none";
    document.getElementById("statusBadge").className = user ? "status-badge online" : "status-badge offline";
    document.getElementById("statusBadge").innerText = user ? "Online" : "Offline";
});