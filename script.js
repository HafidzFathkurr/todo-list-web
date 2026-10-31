// ===== 1. MENGAMBIL ELEMEN DARI HTML =====
// Kita simpan elemen-elemen penting ke dalam variabel
// supaya mudah dipakai berulang kali.
const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-button");
const errorMessage = document.getElementById("error-message");
const taskCounter = document.getElementById("task-counter");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");


// ===== 2. DATA TUGAS =====
// "tasks" adalah array (daftar) yang menyimpan semua tugas.
// Setiap tugas berupa objek dengan 3 data:
//   id        : nomor unik tugas
//   text      : isi tugas
//   completed : true jika sudah selesai, false jika belum
let tasks = [];


// ===== 3. FUNGSI MENAMBAH TUGAS =====
function addTask() {
  // .trim() menghapus spasi di awal dan akhir teks,
  // jadi input yang hanya berisi spasi juga dianggap kosong.
  const taskText = taskInput.value.trim();

  // Validasi: jika kosong, tampilkan pesan error lalu berhenti.
  if (taskText === "") {
    errorMessage.textContent = "Tugas tidak boleh kosong!";
    return; // "return" menghentikan fungsi di sini
  }

  // Jika valid, hapus pesan error yang mungkin masih tampil
  errorMessage.textContent = "";

  // Buat objek tugas baru
  const newTask = {
    id: Date.now(), // waktu saat ini (dalam angka) dipakai sebagai id unik
    text: taskText,
    completed: false
  };

  // Masukkan tugas baru ke dalam array
  tasks.push(newTask);

  // Kosongkan kolom input dan arahkan kursor kembali ke sana
  taskInput.value = "";
  taskInput.focus();

  // Tampilkan ulang daftar tugas
  renderTasks();
}

// ===== 3B. FUNGSI MENANDAI TUGAS SELESAI =====
// Menerima id tugas yang checkbox-nya diklik
function toggleTask(taskId) {
  // Cari tugas yang id-nya cocok, lalu balik nilai completed-nya:
  // false menjadi true, true menjadi false
  tasks.forEach(function (task) {
    if (task.id === taskId) {
      task.completed = !task.completed;
    }
  });

  // Tampilkan ulang daftar agar perubahan terlihat
  renderTasks();
}


// ===== 3C. FUNGSI MENGHAPUS TUGAS =====
// Menerima id tugas yang tombol Hapus-nya diklik
function deleteTask(taskId) {
  // filter() membuat array baru yang hanya berisi tugas
  // yang id-nya BERBEDA dari tugas yang ingin dihapus.
  // Artinya, tugas dengan id tersebut "hilang" dari array.
  tasks = tasks.filter(function (task) {
    return task.id !== taskId;
  });

  // Tampilkan ulang daftar
  renderTasks();
}


// ===== 4. FUNGSI MENAMPILKAN TUGAS =====
function renderTasks() {
  // Kosongkan daftar lama agar tidak muncul dua kali
  taskList.innerHTML = "";

  // Ulangi untuk setiap tugas di dalam array
  tasks.forEach(function (task) {
    // Buat elemen <li> untuk satu tugas
    const listItem = document.createElement("li");
    listItem.className = "task-item";

    // Jika tugas sudah selesai, tambahkan kelas "completed"
    // agar teksnya tercoret (gaya dari style.css)
    if (task.completed === true) {
      listItem.classList.add("completed");
    }

    // Checkbox (belum berfungsi, akan dibuat di Tahap 4)
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    // Saat checkbox diklik, jalankan toggleTask untuk tugas ini
    checkbox.addEventListener("change", function () {
      toggleTask(task.id);
    });

    // Teks tugas
    const taskTextElement = document.createElement("span");
    taskTextElement.className = "task-text";
    taskTextElement.textContent = task.text;

    // Tombol Edit (belum berfungsi, akan dibuat di Tahap 5)
    const editButton = document.createElement("button");
    editButton.className = "edit-button";
    editButton.textContent = "Edit";

    // Tombol Hapus (belum berfungsi, akan dibuat di Tahap 4)
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Hapus";

    // Saat tombol Hapus diklik, jalankan deleteTask untuk tugas ini
    deleteButton.addEventListener("click", function () {
      deleteTask(task.id);
    });

    // Susun semuanya ke dalam <li>
    listItem.appendChild(checkbox);
    listItem.appendChild(taskTextElement);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    // Masukkan <li> ke dalam daftar <ul>
    taskList.appendChild(listItem);
  });

  // Perbarui pesan kosong dan penghitung
  updateEmptyMessage();
  updateCounter();
}


// ===== 5. FUNGSI PESAN KOSONG =====
function updateEmptyMessage() {
  // Jika tidak ada tugas, tampilkan pesan. Jika ada, sembunyikan.
  if (tasks.length === 0) {
    emptyMessage.hidden = false;
  } else {
    emptyMessage.hidden = true;
  }
}


// ===== 6. FUNGSI PENGHITUNG TUGAS =====
function updateCounter() {
  // Hitung tugas yang completed-nya masih false
  let unfinishedCount = 0;

  tasks.forEach(function (task) {
    if (task.completed === false) {
      unfinishedCount++;
    }
  });

  taskCounter.textContent = unfinishedCount + " tugas belum selesai";
}


// ===== 7. MENGHUBUNGKAN TOMBOL DAN KEYBOARD =====
// Saat tombol "Tambah" diklik, jalankan addTask
addButton.addEventListener("click", addTask);

// Saat menekan tombol Enter di kolom input, jalankan addTask juga
taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});


// ===== 8. TAMPILKAN KONDISI AWAL =====
// Dipanggil sekali saat halaman dibuka
renderTasks();