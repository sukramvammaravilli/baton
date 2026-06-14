function showToast(message, type) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.className = `toast ${type}`;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      showToast("Login Successful", "success");
      localStorage.setItem("token", data.token);
      localStorage.setItem("fullname", data.fullname);
      localStorage.setItem("username", data.username);
      setTimeout(() => {
        window.location.href = "/dashboard.html";
      }, 1500);
    } else {
      showToast(data.error || "Invalid Username or Password", "error");
    }
  } catch (error) {
    showToast("Server Error. Please try again.", "error");
  }
});
