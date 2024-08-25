const noteInput = document.getElementById("noteInput");
const addNoteButton = document.getElementById("addNoteButton");
const notesContainer = document.getElementById("notesContainer");

// Load saved notes from local storage
const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
savedNotes.forEach((note) => {
  createNoteElement(note.text, note.timestamp);
});

addNoteButton.addEventListener("click", () => {
  const noteText = noteInput.value.trim();
  if (noteText) {
    const timestamp = new Date().toLocaleString();
    createNoteElement(noteText, timestamp);
    saveNoteToLocalStorage(noteText, timestamp);
    noteInput.value = "";
  }
});

function createNoteElement(text, timestamp) {
  const noteElement = document.createElement("div");
  noteElement.className = "note";

  noteElement.insertAdjacentHTML(
    "beforeend",
    `<div class="textarea_buttons">
              <textarea disabled="true">${text}</textarea>
              <div class="buttons">
                <button class="editButton"><i class="fa fa-edit"></i></button>
                <button class="deleteButton"><i class="fa fa-trash-alt"></i></button>
              </div>
    </div>
    <div class="timestamp">Created on: ${timestamp}</div>
    <button class="doneButton" style="display: none;"><i class="fa fa-check"></i> Done</button>
        `
  );

  notesContainer.appendChild(noteElement);

  const deleteButton = noteElement.querySelector(".deleteButton");
  deleteButton.addEventListener("click", () => {
    noteElement.remove();
    removeNoteFromLocalStorage(text, timestamp);
  });

  const editButton = noteElement.querySelector(".editButton");
  const doneButton = noteElement.querySelector(".doneButton");
  const textarea = noteElement.querySelector("textarea");

  editButton.addEventListener("click", () => {
    textarea.disabled = false;
    textarea.style.borderColor = "gray"
    // editButton.style.display = "none";
    doneButton.style.display = "inline-block";
  });

  doneButton.addEventListener("click", () => {
    const newText = textarea.value.trim();
    textarea.style.borderColor = "rgb(245, 243, 243)"
    if (newText) {
      const newTimestamp = new Date().toLocaleString();
      textarea.disabled = true;
    //   editButton.style.display = "inline-block";
      doneButton.style.display = "none";
      noteElement.querySelector(
        ".timestamp"
      ).textContent = `Created on: ${newTimestamp}`;
      updateNoteInLocalStorage(text, timestamp, newText, newTimestamp);
    }

  });
}

function saveNoteToLocalStorage(text, timestamp) {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.push({ text, timestamp });
  localStorage.setItem("notes", JSON.stringify(notes));
}

function removeNoteFromLocalStorage(text, timestamp) {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes = notes.filter(
    (note) => note.text !== text || note.timestamp !== timestamp
  );
  localStorage.setItem("notes", JSON.stringify(notes));
}

function updateNoteInLocalStorage(
  oldText,
  oldTimestamp,
  newText,
  newTimestamp
) {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes = notes.map((note) =>
    note.text === oldText && note.timestamp === oldTimestamp
      ? { text: newText, timestamp: newTimestamp }
      : note
  );
  localStorage.setItem("notes", JSON.stringify(notes));
}
