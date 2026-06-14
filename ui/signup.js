function showToast(message, type) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.className = `toast ${type}`;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}
const passwordInput = document.getElementById("password");
passwordInput.addEventListener("keyup", function () {
  const password = this.value;
  toggleRule("rule-length", password.length >= 8);
  toggleRule("rule-upper", /[A-Z]/.test(password));
  toggleRule("rule-lower", /[a-z]/.test(password));
  toggleRule("rule-number", /[0-9]/.test(password));
  toggleRule("rule-symbol", /[^A-Za-z0-9]/.test(password));
});

function toggleRule(id, valid) {
  const element = document.getElementById(id);
  if (valid) {
    element.classList.remove("invalid");
    element.classList.add("valid");
  } else {
    element.classList.remove("valid");
    element.classList.add("invalid");
  }
}

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: document.getElementById("username").value,
        fullname: document.getElementById("fullname").value,
        email: document.getElementById("email").value,
        mobile: document.getElementById("mobile").value,
        identityNumber: document.getElementById("identityNumber").value,
        password: document.getElementById("password").value,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      showToast("Registration Successful", "success");
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 1500);
    } else {
      showToast(data.error || "Registration Failed", "error");
    }
  } catch (error) {
    showToast("Something went wrong", "error");
  }
});
