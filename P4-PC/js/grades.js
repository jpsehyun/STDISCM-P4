document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("jwt");
  const list = document.getElementById("grade-list");

  try {
    const res = await fetch("http://192.168.254.123:8080/enrollments", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      list.innerHTML = "<li>Failed to fetch grades.</li>";
      return;
    }

    const grades = await res.json();

    if (grades.length === 0) {
      list.innerHTML = "<li>No grades available yet.</li>";
      return;
    }

    grades.forEach(entry => {
      const li = document.createElement("li");
      const gradeDisplay = entry.grade === null ? "Pending" : entry.grade;
      li.textContent = `${entry.courseTitle}: ${gradeDisplay}`;
      list.appendChild(li);
    });

  } catch (err) {
    console.error("Error loading grades:", err);
    list.innerHTML = "<li>Error loading grades.</li>";
  }
});
