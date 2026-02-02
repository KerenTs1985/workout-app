let exercises = []; // נטען מה-JSON
let workout = [];   // האימון מתחיל ריק

// כתובת JSON הציבורי שלך ב-GitHub
const exercisesURL = "https://raw.githubusercontent.com/KerenTs1985/workout-app/main/exercises.json";

// טעינת המאגר
fetch(exercisesURL)
  .then(res => res.json())
  .then(data => {
    exercises = data;
    renderExercises();
  })
  .catch(err => console.error("שגיאה בטעינת המאגר:", err));

// --- פונקציות --- //

function renderExercises() {
  const list = document.getElementById("exercisePool");
  list.innerHTML = "";
  exercises.forEach(ex => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <span>${ex.name}</span>
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

// הוספה לאימון
function addToWorkout(id) {
  workout.push({ exerciseId: id, sets: "3x10", done: false, customName: null });
  renderWorkout();
}

// סימון ✔️
function toggleDone(index) {
  workout[index].done = !workout[index].done;
  renderWorkout();
}

// מחיקה מהאימון
function removeFromWorkout(index) {
  workout.splice(index, 1);
  renderWorkout();
}

// מחיקה מהמאגר
function removeFromExercise(id) {
  exercises = exercises.filter(e => e.id !== id);
  workout = workout.filter(item => item.exerciseId !== id);
  renderExercises();
  renderWorkout();
}

// הוספת תרגיל חדש
function addExercise() {
  const input = document.getElementById("newExercise");
  const value = input.value.trim();
  if (!value) return alert("הכנס שם תרגיל!");
  
  const newId = exercises.length ? Math.max(...exercises.map(e => e.id)) + 1 : 1;
  exercises.push({ id: newId, name: value, category: "כללי" });

  input.value = "";
  renderExercises();
}

// איפוס האימון
function clearWorkout() {
  workout = [];
  renderWorkout();
}

document.getElementById("addExerciseBtn").addEventListener("click", addExercise);
document.getElementById("clearWorkoutBtn").addEventListener("click", clearWorkout);
