let exercises = []; // נטען מה-JSON
let workout = [];   // האימון מתחיל ריק

const exercisesURL = "https://raw.githubusercontent.com/KerenTs1985/workout-app/main/exercises.json";

// --- פונקציה לטעינת תרגילים מה-JSON --- //
function loadExercises() {
  fetch(exercisesURL + "?t=" + new Date().getTime()) // מניעת cache
    .then(res => res.json())
    .then(data => {
      exercises = data;
      renderExercises();
      renderWorkout(); // אם התרגילים נמחקו מהמאגר, עדכן גם את האימון
    })
    .catch(err => console.error("שגיאה בטעינת המאגר:", err));
}

// --- פונקציות רינדור --- //
function renderExercises() {
  const list = document.getElementById("exercisePool");
  list.innerHTML = "";
  exercises.forEach(ex => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <span>${ex.name} (${ex.category})</span>
      <button class="add-btn" onclick="addToWorkout(${ex.id})">➕</button>
      <button class="delete-btn" onclick="removeFromExercise(${ex.id})">🗑️</button>
    `;
    list.appendChild(card);
  });
}

function renderWorkout() {
  const list = document.getElementById("workout");
  list.innerHTML = "";
  workout.forEach((item, index) => {
    const ex = exercises.find(e => e.id === item.exerciseId);
    if (!ex) return;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <span>${item.customName || ex.name} – ${item.sets}</span>
      <input type="checkbox" ${item.done ? "checked" : ""} onchange="toggleDone(${index})">
      <button class="delete-btn" onclick="removeFromWorkout(${index})">🗑️</button>
    `;
    list.appendChild(card);
  });
}

// --- פונקציות אינטראקציה --- //
function addToWorkout(id) {
  workout.push({ exerciseId: id, sets: "3x10", done: false, customName: null });
  renderWorkout();
}

function toggleDone(index) {
  workout[index].done = !workout[index].done;
  renderWorkout();
}

function removeFromWorkout(index) {
  workout.splice(index, 1);
  renderWorkout();
}

function removeFromExercise(id) {
  exercises = exercises.filter(e => e.id !== id);
  workout = workout.filter(item => item.exerciseId !== id);
  renderExercises();
  renderWorkout();
}

function addExercise() {
  const input = document.getElementById("newExercise");
  const value = input.value.trim();
  if (!value) return alert("הכנס שם תרגיל!");
  
  const newId = exercises.length ? Math.max(...exercises.map(e => e.id)) + 1 : 1;
  const category = prompt("בחר קטגוריה לתרגיל: ח
