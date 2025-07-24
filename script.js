// Prompt for username
const user = prompt("Enter your name:");
let selectedUser = null; // Must be declared early
let unsubscribe = null;  // To remove previous Firebase listener

// Simulated contact list (replace with dynamic fetch in future)
const contacts = ["john", "riya", "alex", "piyush", "mira"];
const userList = document.getElementById("userList");

// Display contacts
contacts.forEach((contact) => {
    if (contact === user) return;

    const div = document.createElement("div");
    div.className = "user";
    div.textContent = contact;

    div.addEventListener("click", () => {
        selectedUser = contact;
        document.getElementById("chatHeader").textContent = `Chatting with ${contact}`;
        loadChat(user, contact);
    });

    userList.appendChild(div);
});


// ─── Firebase Setup ─────────────────────────────────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
    getDatabase,
    ref,
    push,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBEzcUT_YCR2D8-MIsh-dhFAPeEzHctOPg",
    authDomain: "chitchat-4f165.firebaseapp.com",
    databaseURL: "https://chitchat-4f165-default-rtdb.firebaseio.com",
    projectId: "chitchat-4f165",
    storageBucket: "chitchat-4f165.appspot.com",  // ✅ Corrected
    messagingSenderId: "294958015426",
    appId: "1:294958015426:web:d146cb7c5a80159d9cac5b",
    measurementId: "G-1XCMZTCXQP"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


// ─── DOM Elements ─────────────────────────────────────────────
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");

// ─── Generate Unique Room ID ──────────────────────────────────
function getRoomId(user1, user2) {
    return [user1, user2].sort().join("_");
}

// ─── Load Chat Between Two Users ──────────────────────────────
function loadChat(currentUser, chatUser) {
    chatBox.innerHTML = "";

    const roomId = getRoomId(currentUser, chatUser);
    const roomRef = ref(db, "privateChats/" + roomId);

    // Remove old listener
    if (unsubscribe) unsubscribe();

    // Realtime listener for new messages
    unsubscribe = onValue(roomRef, (snapshot) => {
        chatBox.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const msgDiv = document.createElement("div");
            msgDiv.classList.add("message");
            msgDiv.classList.add(data.sender === currentUser ? "sent" : "received");
            msgDiv.textContent = `${data.sender}: ${data.text}`;
            chatBox.appendChild(msgDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        });
    });

    // Send new message
    sendBtn.onclick = function () {
        const msg = messageInput.value.trim();
        if (msg === "") return;

        push(roomRef, {
            text: msg,
            sender: currentUser,
            timestamp: Date.now()
        });

        messageInput.value = "";
    };
}


// ─── Clear Chat ───────────────────────────────────────────────
clearBtn.addEventListener("click", () => {
    if (!selectedUser) return alert("Select a user first.");

    const roomId = getRoomId(user, selectedUser);
    const chatRef = ref(db, "privateChats/" + roomId);

    const confirmDelete = confirm(`Clear chat with ${selectedUser}?`);
    if (confirmDelete) {
        remove(chatRef)
            .then(() => {
                chatBox.innerHTML = "";
                alert("Chat cleared!");
            })
            .catch((error) => {
                console.error("Error clearing chat:", error);
                alert("Failed to clear chat.");
            });
    }
});
