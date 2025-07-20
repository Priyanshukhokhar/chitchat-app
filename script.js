const user = prompt("Enter your name:");


// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
    getDatabase,
    ref,
    push,
    onChildAdded
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

// Your Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBEzcUT_YCR2D8-MIsh-dhFAPeEzHctOPg",
    authDomain: "chitchat-4f165.firebaseapp.com",
    databaseURL: "https://chitchat-4f165-default-rtdb.firebaseio.com",
    projectId: "chitchat-4f165",
    storageBucket: "chitchat-4f165.firebasestorage.app",
    messagingSenderId: "294958015426",
    appId: "1:294958015426:web:d146cb7c5a80159d9cac5b",
    measurementId: "G-1XCMZTCXQP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// Send Message to Firebase
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (message === "") return;

    const chatRef = ref(db, "messages");
    push(chatRef, {
        text: message,
        sender: user,
        timestamp: Date.now()
    });


    messageInput.value = "";
}

// Listen for New Messages
const chatRef = ref(db, "messages");
onChildAdded(chatRef, (snapshot) => {
  const data = snapshot.val();

  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message");

  if (data.sender === user) {
    msgDiv.classList.add("sent");
  } else {
    msgDiv.classList.add("received");
  }

  msgDiv.textContent = `${data.sender}: ${data.text}`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
});


//clear chat button
import { remove } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const clearBtn = document.getElementById("clearBtn");

clearBtn.addEventListener("click",()=>{
    const chatRef = ref(db, "message");
    const confirmDelete = confirm("Are you sure you want to clear the entire chat?");
    if(confirmDelete){
        remove(chatRef)
        .then(()=>{
            chatBox.innerHTML="";
            alert("chat cleared!");
        })
        .catch((error)=>{
            console.error("Error clearing chat:",error);
            alert("failed to clear chat.");
        })
    }
})