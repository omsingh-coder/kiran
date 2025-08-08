import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  update
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCT70w5hwEZqELdgoFYGyAuGqP9AQsAqu4",
  authDomain: "mylaw-c3414.firebaseapp.com",
  databaseURL: "https://mylaw-c3414-default-rtdb.firebaseio.com",
  projectId: "mylaw-c3414",
  storageBucket: "mylaw-c3414.appspot.com",
  messagingSenderId: "449744223319",
  appId: "1:449744223319:web:8eadf59519800edc927712",
  measurementId: "G-L50E12B128"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const defaultQuestions = [
  "Deepest fears",
  "Her biggest secret",
  "Painful memories she never shared",
  "What keeps her up at night",
  "What she hides behind her smile",
  "Her past heartbreaks",
  "Her anxiety triggers",
  "Her unsent letters",
  "Her “if I could say this” entries",
  "Confessions she never told anyone"
];

const questionsContainer = document.getElementById("questionsContainer");
const sliderPanel = document.getElementById("sliderPanel");
const sliderContent = document.getElementById("sliderContent");
const toggleSlider = document.getElementById("toggleSlider");
const addBtn = document.getElementById("addBtn");
const newQuestionInput = document.getElementById("newQuestion");

toggleSlider.onclick = () => {
  sliderPanel.classList.toggle("open");
};

addBtn.onclick = () => {
  const q = newQuestionInput.value.trim();
  if (q) {
    set(ref(db, "privateThoughts/" + q), "");
    newQuestionInput.value = "";
  }
};

function renderData(firebaseData = {}) {
  questionsContainer.innerHTML = "";
  sliderContent.innerHTML = "";

  // Combine default + user-added questions
  const allQuestions = new Set([...defaultQuestions, ...Object.keys(firebaseData)]);

  allQuestions.forEach((question) => {
    const answer = firebaseData[question] || "";

    // --- Main area ---
    const qDiv = document.createElement("div");
    qDiv.className = "question";
    qDiv.innerHTML = `
      <h3>${question}</h3>
      <p>${answer ? answer : "<em>No answer yet.</em>"}</p>
    `;
    questionsContainer.appendChild(qDiv);

    // --- Slider panel ---
    const editDiv = document.createElement("div");
    editDiv.innerHTML = `
      <h4>${question}</h4>
      <textarea id="ta-${question}">${answer}</textarea>
      <button onclick="saveAnswer('${question.replace(/'/g, "\\'")}')">💾 Save</button>
      <button onclick="clearAnswer('${question.replace(/'/g, "\\'")}')">🗑️ Delete Answer</button>
      <hr/>
    `;
    sliderContent.appendChild(editDiv);
  });
}

// Global functions for buttons
window.saveAnswer = function (question) {
  const textarea = document.getElementById("ta-" + question);
  if (textarea) {
    const value = textarea.value;
    set(ref(db, "privateThoughts/" + question), value);
  }
};

window.clearAnswer = function (question) {
  set(ref(db, "privateThoughts/" + question), ""); // Just clear the answer
};

// Fetch and render data live
onValue(ref(db, "privateThoughts"), (snapshot) => {
  const data = snapshot.val() || {};
  renderData(data);
});