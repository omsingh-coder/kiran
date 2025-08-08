import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, update, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCT70w5hwEZqELdgoFYGyAuGqP9AQsAqu4",
  authDomain: "mylaw-c3414.firebaseapp.com",
  databaseURL: "https://mylaw-c3414-default-rtdb.firebaseio.com",
  projectId: "mylaw-c3414",
  storageBucket: "mylaw-c3414.firebasestorage.app",
  messagingSenderId: "449744223319",
  appId: "1:449744223319:web:8eadf59519800edc927712",
  measurementId: "G-L50E12B128"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const notesRef = ref(db, "relationship-notes");

let editingKey = null;
let isEditing = false;

const notesContainer = document.getElementById("notesContainer");
const formContainer = document.getElementById("formContainer");
const questionInput = document.getElementById("questionInput");
const answerInput = document.getElementById("answerInput");

const presetQuestions = [
  "First impression of you",
  "What attracted her to you",
  "What she admires in you",
  "Something she hasn’t told you yet",
  "Things you do that make her feel loved",
  "Her expectations from you",
  "What she wants from this relationship",
  "One unforgettable moment with you",
  "What she wants you to never stop doing",
  "What she wants to do together someday",
  "How she feels when she misses you",
  "What would hurt her most from you",
  "How she sees the future with you"
];

// Add preset questions if DB is empty
get(notesRef).then(snapshot => {
  if (!snapshot.exists()) {
    presetQuestions.forEach(q => {
      push(notesRef, { question: q, answer: "" });
    });
  }
});

function toggleAddForm() {
  editingKey = null;
  isEditing = false;
  questionInput.value = "";
  answerInput.value = "";
  formContainer.classList.remove("hidden");
}

function cancelEdit() {
  editingKey = null;
  isEditing = false;
  formContainer.classList.add("hidden");
}

function saveNote() {
  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();

  if (!question) return;

  if (editingKey && isEditing) {
    // Updating existing
    update(ref(db, `relationship-notes/${editingKey}`), { question, answer });
  } else {
    // New note
    push(notesRef, { question, answer });
  }

  cancelEdit();
}

function deleteAnswerOnly(key) {
  update(ref(db, `relationship-notes/${key}`), { answer: "" });
}

function editNote(key, data) {
  editingKey = key;
  isEditing = true;
  questionInput.value = data.question;
  answerInput.value = data.answer;
  formContainer.classList.remove("hidden");
}

onValue(notesRef, snapshot => {
  notesContainer.innerHTML = "";
  snapshot.forEach(child => {
    const data = child.val();
    const note = document.createElement("div");
    note.className = "note";
    note.innerHTML = `
      <h3>${data.question}</h3>
      <p>${data.answer || "(No answer yet)"}</p>
      <div class="actions">
        <button onclick="editNote('${child.key}', ${JSON.stringify(data).replace(/"/g, '&quot;')})">✏️</button>
        <button onclick="deleteAnswerOnly('${child.key}')">🗑️</button>
      </div>
    `;
    notesContainer.appendChild(note);
  });
});

window.toggleAddForm = toggleAddForm;
window.cancelEdit = cancelEdit;
window.saveNote = saveNote;
window.deleteAnswerOnly = deleteAnswerOnly;
window.editNote = editNote;