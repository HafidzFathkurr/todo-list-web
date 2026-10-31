// ===== 1. MENGAMBIL ELEMEN DARI HTML =====
const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-button");
const errorMessage = document.getElementById("error-message");
const taskCounter = document.getElementById("task-counter");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");

// Semua tombol filter diambil sekaligus (hasilnya berupa daftar tombol)
const filterButtons = document.querySelectorAll(".filter-button");


// ===== 2. DATA APLIKASI =====
// Array yang menyimpan semua tugas.
// Setiap tugas: { id, text, completed }
let tasks = [];

// Filter yang sedang dipilih: "all", "active", atau "completed"
let currentFilter = "all";


// ===== 3. FUNGSI MENAMBAH TUGAS =====
function addTask() {
  const taskText = taskInput.value.trim();

  // Validasi: tugas kosong tidak boleh ditambahkan
  if (taskText === "") {
    errorMessage.textContent = "Tugas tidak boleh kosong!";
    return;
  }

  errorMessage.textContent = "";

  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false
  };

  tasks.push(newTask);

  taskInput.value = "";
  taskInput.focus();

  renderTasks();
}


// ===== 4. FUNGSI MENANDAI TUGAS SELESAI =====
function toggleTask(taskId) {
  tasks.forEach(function (task) {
    if (task.id === taskId) {
      task.completed = !task.completed;
    }
  });

  renderTasks();
}


// ===== 5. FUNGSI MENGHAPUS TUGAS =====
function deleteTask(taskId) {
  tasks = tasks.filter(function (task) {
    return task.id !== taskId;
  });

  renderTasks();
}


// ===== 6. FUNGSI MENGEDIT TUGAS (BARU) =====
function editTask(taskId) {
  // Cari tugas yang ingin diedit
  const taskToEdit = tasks.find(function (task) {
    return task.id === taskId;
  });

  // prompt() menampilkan kotak dialog dengan teks lama sudah terisi
  const newText = prompt("Edit tugas:", taskToEdit.text);

  // Jika pengguna menekan "Cancel", hasilnya null: tidak ada yang diubah
  if (newText === null) {
    return;
  }

  const trimmedText = newText.trim();

  // Validasi: hasil edit tidak boleh kosong
  if (trimmedText === "") {
    alert("Tugas tidak boleh kosong!");
    return;
  }

  // Simpan teks baru, lalu tampilkan ulang daftar
  taskToEdit.text = trimmedText;
  renderTasks();
}


// ===== 7. FUNGSI MEMILIH TUGAS SESUAI FILTER (BARU) =====
// Mengembalikan daftar tugas yang boleh ditampilkan saat ini
function getFilteredTasks() {
  if (currentFilter === "active") {
    // Hanya tugas yang belum selesai
    return tasks.filter(function (task) {
      return task.completed === false;
    });
  }

  if (currentFilter === "completed") {
    // Hanya tugas yang sudah selesai
    return tasks.filter(function (task) {
      return task.completed === true;
    });
  }

  // Jika "all", tampilkan semuanya
  return tasks;
}


// ===== 8. FUNGSI MENAMPILKAN TUGAS =====
function renderTasks() {
  taskList.innerHTML = "";

  // Ambil tugas yang sudah disaring sesuai filter
  const visibleTasks = getFilteredTasks();

  visibleTasks.forEach(function (task) {
    const listItem = document.createElement("li");
    listItem.className = "task-item";

    // Tugas selesai diberi kelas "completed" (teks tercoret)
    if (task.completed === true) {
      listItem.classList.add("completed");
    }

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", function () {
      toggleTask(task.id);
    });

    // Teks tugas
    const taskTextElement = document.createElement("span");
    taskTextElement.className = "task-text";
    taskTextElement.textContent = task.text;

    // Tombol Edit (sekarang sudah berfungsi)
    const editButton = document.createElement("button");
    editButton.className = "edit-button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", function () {
      editTask(task.id);
    });

    // Tombol Hapus
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Hapus";
    deleteButton.addEventListener("click", function () {
      deleteTask(task.id);
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(taskTextElement);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    taskList.appendChild(listItem);
  });

  updateEmptyMessage(visibleTasks);
  updateCounter();
  updateFilterButtons();
}


// ===== 9. FUNGSI PESAN KOSONG (DIPERBARUI) =====
// Pesannya menyesuaikan kondisi: daftar benar-benar kosong,
// atau kosong hanya karena filter yang dipilih.
function updateEmptyMessage(visibleTasks) {
  if (visibleTasks.length > 0) {
    emptyMessage.hidden = true;
    return;
  }

  emptyMessage.hidden = false;

  if (tasks.length === 0) {
    emptyMessage.textContent = "Belum ada tugas. Yuk tambahkan satu!";
  } else if (currentFilter === "active") {
    emptyMessage.textContent = "Semua tugas sudah selesai. Kerja bagus!";
  } else {
    emptyMessage.textContent = "Belum ada tugas yang selesai.";
  }
}


// ===== 10. FUNGSI PENGHITUNG TUGAS =====
// Penghitung selalu menghitung SEMUA tugas, tidak terpengaruh filter
function updateCounter() {
  let unfinishedCount = 0;

  tasks.forEach(function (task) {
    if (task.completed === false) {
      unfinishedCount++;
    }
  });

  taskCounter.textContent = unfinishedCount + " tugas belum selesai";
}


// ===== 11. FUNGSI TAMPILAN TOMBOL FILTER (BARU) =====
// Memberi kelas "active" hanya pada tombol filter yang sedang dipilih
function updateFilterButtons() {
  filterButtons.forEach(function (button) {
    if (button.dataset.filter === currentFilter) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}


// ===== 12. MENGHUBUNGKAN TOMBOL DAN KEYBOARD =====
addButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// Pasang aksi klik pada setiap tombol filter (BARU)
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // data-filter pada HTML dibaca lewat button.dataset.filter
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});


// ===== 13. TAMPILKAN KONDISI AWAL =====
renderTasks();