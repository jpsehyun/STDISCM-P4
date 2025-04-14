document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("jwt");

  try {
    const res = await fetch("http://192.168.254.123:8083/courses", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const courses = await res.json();

    const list = document.getElementById("faculty-course-list");
    list.innerHTML = "";

    for (const course of courses) {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${course.title}</strong>`;

      const studentList = document.createElement("ul");

      const enrollmentsRes = await fetch(`http://192.168.254.123:8080/enrollments/course/${course.id}`, {
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
          const payload = {
            id: enrollment.id,
            grade: input.value
          };

          try {
            const gradeRes = await fetch(`http://192.168.254.123:8082/grades/${payload.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ grade: payload.grade })
            });

            if (!gradeRes.ok) {
              throw new Error("Non-200 response");
            }

            alert("Grade updated!");
          } catch (err) {
            alert("Grade service unavailable. Grade will retry in background.");
            const retryQueue = JSON.parse(localStorage.getItem("gradeRetryQueue") || "[]");
            retryQueue.push(payload);
            localStorage.setItem("gradeRetryQueue", JSON.stringify(retryQueue));
          }
        };

        studentLi.appendChild(input);
        studentLi.appendChild(button);
        studentList.appendChild(studentLi);
      });

      li.appendChild(studentList);
      list.appendChild(li);
    }

  } catch (err) {
    console.error("Error loading faculty dashboard:", err);
    const msg = document.createElement("p");
    msg.style.color = "red";
    msg.textContent = "Unable to load data. Backend node may be unavailable.";
    document.body.appendChild(msg);
  }

  setInterval(async () => {
    const retryQueue = JSON.parse(localStorage.getItem("gradeRetryQueue") || "[]");
    if (retryQueue.length === 0) return;

    const newQueue = [];
    for (const attempt of retryQueue) {
      try {
        const retryRes = await fetch(`http://192.168.254.123:8082/grades/${attempt.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ grade: attempt.grade })
        });

        if (!retryRes.ok) {
          throw new Error("Retry failed");
        }

        console.log(`Successfully retried grade for enrollment ID ${attempt.id}`);
      } catch (err) {
        console.log(`Still failed: enrollment ID ${attempt.id}`);
        newQueue.push(attempt);
      }
    }

    localStorage.setItem("gradeRetryQueue", JSON.stringify(newQueue));
  }, 5000);
});
