document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");
    const button = document.querySelector(".btn");

    message.textContent = "";

    if (!username || !password) {
      message.textContent = "Username dan password wajib diisi!";
      message.style.color = "red";
      return;
    }

    button.disabled = true;
    button.textContent = "Logging in...";
    button.style.opacity = "0.7";
    message.textContent = "Please wait...";
    message.style.color = "gray";

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login gagal. Periksa username dan password!");
      }

      const data = await response.json();

      message.textContent = `Login berhasil! Selamat datang, ${data.username}`;
      message.style.color = "green";

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("username", data.username);

      setTimeout(() => {
        window.location.href = "recipes.html";
      }, 1500);
    } catch (error) {
      message.textContent = error.message;
      message.style.color = "red";
      console.error("Error:", error);
    } finally {
      button.disabled = false;
      button.textContent = "Login";
      button.style.opacity = "1";
    }
  });
