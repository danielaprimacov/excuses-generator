const USERS_KEY = "users";
const SESSION_KEY = "user";

function loadUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function loadSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY));
}
function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getRegisteredUsers() {
  return loadUsers();
}

export function register({ username, password }) {
  const users = loadUsers();
  if (users.find((u) => u.username === username)) {
    return { ok: false, message: "Username already exists" };
  }
  users.push({ username, password });
  saveUsers(users);
  return { ok: true };
}

export function login({ username, password }) {
  const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || "letmein";
  if (username === "admin" && password === adminPass) {
    const adminUser = { username: "admin", role: "admin" };
    saveSession(adminUser);
    return { ok: true, user: adminUser };
  }

  const users = loadUsers();
  const match = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!match) {
    return { ok: false, message: "Invalid credentials" };
  }
  const normalUser = { username, role: "user" };
  saveSession(normalUser);
  return { ok: true, user: normalUser };
}

export function logout() {
  clearSession();
}

export function getCurrentUser() {
  return loadSession();
}
