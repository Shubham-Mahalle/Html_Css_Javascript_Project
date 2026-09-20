const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
let currentStudent;
let studentTasks = [];
let editTaskNumber;

document.getElementById("showLogin").onclick = function () {
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
    this.classList.add("active");
    document.getElementById("showSignup").classList.remove("active");
};

document.getElementById("showSignup").onclick = function () {
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    this.classList.add("active");
    document.getElementById("showLogin").classList.remove("active");
};

signupForm.onsubmit = function (event) {
    event.preventDefault();
    const students = JSON.parse(localStorage.getItem("studentAccounts")) || [];
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const skills = [];
    document.querySelectorAll('input[name="skills"]:checked').forEach(function (skill) {
        skills.push(skill.value);
    });

    if (students.find(function (student) { 
        return student.email === email; 
    })) {
        document.getElementById("signupMessage").textContent = "An account with this email already exists.";
        return;
    }

    students.push({
        name: document.getElementById("studentName").value.trim(),
        email: email,
        password: document.getElementById("signupPassword").value,
        age: document.getElementById("age").value,
        course: document.getElementById("course").value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        skills: skills
    });

    localStorage.setItem("studentAccounts", JSON.stringify(students));
    document.getElementById("loginEmail").value = email;
    document.getElementById("loginMessage").textContent = "Account created. Please log in.";
    signupForm.reset();
    document.getElementById("showLogin").click();
};

loginForm.onsubmit = function (event) {
    event.preventDefault();
    const students = JSON.parse(localStorage.getItem("studentAccounts")) || [];
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    currentStudent = students.find(function (student) {
        return student.email === email && student.password === password;
    });

    if (!currentStudent) {
        document.getElementById("loginMessage").textContent = "Email or password is incorrect.";
        return;
    }

    document.getElementById("authSection").classList.add("hidden");
    document.getElementById("portalSection").classList.remove("hidden");
    document.getElementById("userNav").classList.remove("hidden");
    document.getElementById("welcomeName").textContent = "Welcome, " + currentStudent.name + "!";
    studentTasks = JSON.parse(localStorage.getItem("studentTasks_" + email)) || [];
    showTasks();
};

function saveTasks() {
    localStorage.setItem("studentTasks_" + currentStudent.email, JSON.stringify(studentTasks));
}

function showTasks() {
    taskList.innerHTML = "";

    studentTasks.forEach(function (task, number) {
        const item = document.createElement("li");
        const name = document.createElement("span");
        const complete = document.createElement("button");
        const edit = document.createElement("button");
        const remove = document.createElement("button");

        name.textContent = task.text;
        complete.textContent = task.completed ? "Undo" : "Complete";
        edit.textContent = "Edit";
        remove.textContent = "Delete";
        complete.className = "small-button complete-button";
        edit.className = "small-button edit-button";
        remove.className = "small-button delete-button";
        if (task.completed) item.classList.add("completed");

        function completeTask() {
            studentTasks[number].completed = !studentTasks[number].completed;
            saveTasks();
            showTasks();
        }

        complete.onclick = completeTask;
        name.onclick = completeTask;
        edit.onclick = function () {
            editTaskNumber = number;
            document.getElementById("editTaskInput").value = task.text;
            document.getElementById("editBox").classList.remove("hidden");
        };
        remove.onclick = function () {
            studentTasks.splice(number, 1);
            saveTasks();
            showTasks();
        };

        item.append(name, complete, edit, remove);
        taskList.appendChild(item);
    });

    const total = studentTasks.length;
    document.getElementById("taskCount").textContent = total + (total === 1 ? " task" : " tasks");
}

document.getElementById("addTaskButton").onclick = function () {
    const text = taskInput.value.trim();
    if (!text) {
        document.getElementById("taskMessage").textContent = "Please enter a task first.";
        return;
    }
    studentTasks.push({ text: text, completed: false });
    taskInput.value = "";
    document.getElementById("taskMessage").textContent = "";
    saveTasks();
    showTasks();
};

document.getElementById("editTaskForm").onsubmit = function (event) {
    event.preventDefault();
    const text = document.getElementById("editTaskInput").value.trim();
    if (text) studentTasks[editTaskNumber].text = text;
    saveTasks();
    showTasks();
    document.getElementById("editBox").classList.add("hidden");
};

document.getElementById("cancelEditButton").onclick = function () {
    document.getElementById("editBox").classList.add("hidden");
};

document.getElementById("profileLink").onclick = function (event) {
    event.preventDefault();
    const student = currentStudent;
    document.getElementById("profileDetails").innerHTML =
        "<p>Name: " + student.name + "</p>" +
        "<p>Email: " + student.email + "</p>" +
        "<p>Age: " + student.age + "</p>" +
        "<p>Course: " + student.course + "</p>" +
        "<p>Gender: " + student.gender + "</p>" +
        "<p>Skills: " + (student.skills.join(", ") || "No skills selected") + "</p>";
    document.getElementById("profile").classList.remove("hidden");
};

document.getElementById("closeProfileButton").onclick = function () {
    document.getElementById("profile").classList.add("hidden");
};

document.getElementById("logoutButton").onclick = function () {
    currentStudent = null;
    studentTasks = [];
    loginForm.reset();
    document.getElementById("portalSection").classList.add("hidden");
    document.getElementById("userNav").classList.add("hidden");
    document.getElementById("authSection").classList.remove("hidden");
};
