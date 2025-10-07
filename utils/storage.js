const STORAGE_KEY = "userData";

function saveUser(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getUser() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

function clearUser() {
  localStorage.removeItem(STORAGE_KEY);
}

window.saveUser = saveUser;
window.getUser = getUser;
window.clearUser = clearUser;
