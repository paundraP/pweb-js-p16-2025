document.addEventListener("DOMContentLoaded", function () {
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    window.location.href = "index.html";
    return;
  }

  const username = localStorage.getItem("username");
  if (username) {
    document.getElementById("userName").textContent = username;
  }
});

document.getElementById("logoutBtn").addEventListener("click", function () {
  const confirmLogout = confirm("Are you sure you want to logout?");

  if (confirmLogout) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");

    alert("Logout successful!");

    window.location.href = "index.html";
  }
});
