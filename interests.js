// Initialize Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const interestsRef = db.collection("interests");

// Default preset questions
const presetQuestions = [
  "Her hobbies",
  "Things she wants to try",
  "What she does when she’s bored",
  "Shows/movies she binges",
  "Artists she follows",
  "What kind of content she enjoys (memes, romance, dark humor)",
  "Any fandoms she’s in?",
  "Talents she has",
  "Music for different moods",
  "Games she loves",
  "Skills she wants to learn"
];

// Add preset questions to Firestore if not already present
async function addPresetQuestions() {
  const snapshot = await interestsRef.get();
  if (snapshot.empty) {
    presetQuestions.forEach((question) => {
      interestsRef.add({ question, answer: "" });
    });
  }
}

addPresetQuestions();

// Render function
function renderInterests(docId, question, answer) {
  const mainList = document.getElementById("interests-list");
  const sliderList = document.getElementById("slider-list");

  // Main Display Area
  const qBlock = document.createElement("div");
  qBlock.className = "interest-item";
  qBlock.innerHTML = `
    <h3>${question}</h3>
    <p>${answer || "<i>No answer yet</i>"}</p>
  `;
  mainList.appendChild(qBlock);

  // Slider Editable Block
  const sBlock = document.createElement("div");
  sBlock.className = "slider-item";
  sBlock.innerHTML = `
    <input type="text" class="edit-question" value="${question}">
    <textarea class="edit-answer" placeholder="Enter answer...">${answer || ""}</textarea>
    <div class="btn-group">
      <button class="save-btn">Save</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;

  // Save button functionality
  sBlock.querySelector(".save-btn").addEventListener("click", () => {
    const newQuestion = sBlock.querySelector(".edit-question").value.trim();
    const newAnswer = sBlock.querySelector(".edit-answer").value.trim();
    interestsRef.doc(docId).set({ question: newQuestion, answer: newAnswer });
  });

  // Delete button functionality
  sBlock.querySelector(".delete-btn").addEventListener("click", () => {
    interestsRef.doc(docId).delete();
  });

  sliderList.appendChild(sBlock);
}

// Realtime sync
interestsRef.onSnapshot((snapshot) => {
  document.getElementById("interests-list").innerHTML = "";
  document.getElementById("slider-list").innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    renderInterests(doc.id, data.question, data.answer);
  });
});

// Add new question
document.getElementById("add-question-btn").addEventListener("click", () => {
  const newQ = prompt("Enter new question:");
  if (newQ && newQ.trim() !== "") {
    interestsRef.add({ question: newQ.trim(), answer: "" });
  }
});