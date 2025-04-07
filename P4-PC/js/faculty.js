document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("jwt");

  try {
    const res = await fetch("http://localhost:8080/courses", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const courses = await res.json();
    const list = document.getElementById("faculty-course-list");
    list.innerHTML = "";

    for (const course of courses) {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${course.title}</strong>`;

      const studentList = document.createElement("ul");

      try {
        const enrollmentsRes = await fetch(`http://localhost:8080/enrollments/course/${course.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const enrollments = await enrollmentsRes.json();

        enrollments.forEach(enrollment => {
          const studentLi = document.createElement("li");
          studentLi.textContent = `Student ${enrollment.userId} - Grade: ${enrollment.grade ?? "N/A"}`;

          const input = document.createElement("input");
          input.placeholder = "Enter grade";

          const button = document.createElement("button");
          button.textContent = "Submit";

          button.onclick = async () => {
            try {
              const gradeRes = await fetch(`http://localhost:8082/grades/${enrollment.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ grade: input.value })
              });

              if (!gradeRes.ok) {
                alert("Failed to update grade.");
              } else {
                alert("Grade updated!");
              }
            } catch (err) {
              alert("Grade service is currently unavailable.");
              console.error("Grade update error:", err);
            }
          };

          studentLi.appendChild(input);
          studentLi.appendChild(button);
          studentList.appendChild(studentLi);
        });

        li.appendChild(studentList);
        list.appendChild(li);
      } catch (err) {
        const errorMsg = document.createElement("p");
        errorMsg.style.color = "red";
        errorMsg.textContent = "Failed to load enrollments for this course.";
        li.appendChild(errorMsg);
        list.appendChild(li);
        console.error("Enrollment loading error:", err);
      }
    }

  } catch (err) {
    const list = document.getElementById("faculty-course-list");
    const errorMsg = document.createElement("p");
    errorMsg.style.color = "red";
    errorMsg.textContent = "Error: Course service node is currently unavailable.";
    list.appendChild(errorMsg);
    console.error("Course loading error:", err);
  }
});
