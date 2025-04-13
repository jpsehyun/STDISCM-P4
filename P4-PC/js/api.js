// api.js
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    fetch("http://192.168.254.123:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Login failed: invalid credentials or server issue.");
        }
        return response.json();
      })
      .then(data => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("username", username); // Save username to check role
      
          if (username === "faculty") {
            window.location.href = "faculty-dashboard.html";
          } else {
            window.location.href = "dashboard.html";
          }
        } else {
          document.getElementById("message").innerText = "Unexpected error.";
        }
      });
  }
  