// Firebase config
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue, set, update, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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

const likes = [
  "Favorite foods, snacks, desserts, drinks",
  "Favorite chocolates or candies",
  "Favorite colors, flowers, clothing styles",
  "Favorite seasons, weather, time of day",
  "Things she loves hearing",
  "Things that calm her down",
  "Favorite animals/pets",
  "Favorite festivals",
  "Comfort items (pillows, plushies?)"
];

const dislikes = [
  "Foods she hates",
  "Habits that annoy her",
  "Things that make her sad/upset",
  "Scents she dislikes",
  "Words or behaviors she hates",
  "Sounds that irritate her",
  "Types of people she avoids"
];

function createEntry(question, category) {
  const container = document.createElement("div");
  container.className = "entry";

  const label = document.createElement("label");
  label.innerText = question;

  const textarea = document.createElement("textarea");

  const actions = document.createElement("div");
  actions.className = "actions";

  const saveBtn = document.createElement("button");
  saveBtn.innerText = "Save";
  saveBtn.onclick = () => {
    const value = textarea.value;
    set(ref(db, `likesDislikes/${category}/${question}`), value);
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Delete";
  deleteBtn.classList.add("delete");
  deleteBtn.onclick = () => {
    remove(ref(db, `likesDislikes/${category}/${question}`));
    textarea.value = "";
  };

  const editBtn = document.createElement("button");
  editBtn.innerText = "Edit";
  editBtn.classList.add("edit");
  editBtn.onclick = () => {
    textarea.disabled = false;
  };

  actions.appendChild(saveBtn);
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  container.appendChild(label);
  container.appendChild(textarea);
  container.appendChild(actions);

  // Realtime load from Firebase
  const questionRef = ref(db, `likesDislikes/${category}/${question}`);
  onValue(questionRef, (snapshot) => {
    const data = snapshot.val();
    textarea.value = data || "";
  });

  return container;
}

const likesList = document.getElementById("likes-list");
likes.forEach(q => likesList.appendChild(createEntry(q, "likes")));

const dislikesList = document.getElementById("dislikes-list");
dislikes.forEach(q => dislikesList.appendChild(createEntry(q, "dislikes")));