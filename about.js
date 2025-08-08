// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCT70w5hwEZqELdgoFYGyAuGqP9AQsAqu4",
  authDomain: "http://mylaw-c3414.firebaseapp.com",
  databaseURL: "https://mylaw-c3414-default-rtdb.firebaseio.com",
  projectId: "mylaw-c3414",
  storageBucket: "http://mylaw-c3414.firebasestorage.app",
  messagingSenderId: "449744223319",
  appId: "1:449744223319:web:8eadf59519800edc927712"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const defaultQuestions = [
  "Birthdate & zodiac",
  "5 words that describe her",
  "What people misunderstand about her",
  "Biggest strength",
  "Secret insecurity",
  "Most confident about?",
  "One memory that changed her",
  "Her comfort routine",
  "Who she opens up to easily",
  "What she wants people to understand about her",
  "Fun fact no one knows",
  "How she handles heartbreak",
  "Best compliment ever received",
  "Her emotional triggers",
  "Her stress relievers",
  "How she handles failure"
];

// Elements
const container = document.getElementById("questionsContainer");
const sliderToggle = document.getElementById("sliderToggle");
const sliderPanel = document.getElementById("sliderPanel");
const editSection = document.getElementById("editSection");
const newQuestionInput = document.getElementById("newQuestionInput");
const addQuestionBtn = document.getElementById("addQuestionBtn");

// Open/close slider
sliderToggle.addEventListener("click", () => {
  sliderPanel.classList.toggle("open");
});

// Load from Firebase
function loadQuestions() {
  db.ref("aboutHer").on("value", snapshot => {
    const data = snapshot.val() || {};
    container.innerHTML = "";
    editSection.innerHTML = "";

    Object.entries(data).forEach(([key, obj]) => {
      renderQuestion(key, obj);
      renderEditBox(key, obj);
    });
  });
}

// Render question to main view
function renderQuestion(id, obj) {
  const box = document.createElement("div");
  box.className = "question-box";
  box.innerHTML = `<h3>${obj.question}</h3><p>${obj.answer || "—"}</p>`;
  container.appendChild(box);
}

// Render edit box in slider
function renderEditBox(id, obj) {
  const box = document.createElement("div");
  box.className = "edit-box";
  box.innerHTML = `
    <input type="text" value="${obj.question}" id="q-${id}" />
    <textarea placeholder="Answer...">${obj.answer || ""}"></textarea>
    <button onclick="saveQA('${id}', this)">Save</button>
    <button onclick="deleteQA('${id}')">Delete Answer</button>
  `;
  editSection.appendChild(box);
}

// ✅ Save QA: correctly targets only the corresponding textarea
function saveQA(id, btn) {
  const parent = btn.closest(".edit-box");
  const qVal = parent.querySelector(`#q-${id}`).value;
  const ans = parent.querySelector("textarea").value;
  db.ref("aboutHer/" + id).set({ question: qVal, answer: ans });
}

// ✅ Delete only the answer (not the question)
function deleteQA(id) {
  if (confirm("Clear the answer?")) {
    db.ref("aboutHer/" + id).update({ answer: "" });
  }
}

// Add new question
addQuestionBtn.addEventListener("click", () => {
  const q = newQuestionInput.value.trim();
  if (q) {
    const id = Date.now();
    db.ref("aboutHer/" + id).set({ question: q, answer: "" });
    newQuestionInput.value = "";
  }
});

// First-time load: populate defaults if not present
db.ref("aboutHer").once("value", snapshot => {
  if (!snapshot.exists()) {
    defaultQuestions.forEach((q, index) => {
      db.ref("aboutHer/" + index).set({ question: q, answer: "" });
    });
  }
  loadQuestions();
});