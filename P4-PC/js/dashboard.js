document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("jwt");
    const courseList = document.getElementById("course-list");
    const statusMessage = document.getElementById("status-message");
  
    try {
      const enrolledRes = await fetch("http://localhost:8080/enrollments", {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (!enrolledRes.ok) throw new Error("Enrollment fetch failed");
      const enrolledCourses = await enrolledRes.json();
      const enrolledCourseIds = enrolledCourses.map(e => e.courseId);
  
      const res = await fetch("http://localhost:8080/courses", {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (!res.ok) throw new Error("Course fetch failed");
      const courses = await res.json();
      courseList.innerHTML = "";
  
      courses.forEach(course => {
        const li = document.createElement("li");
        li.textContent = `${course.code} - ${course.title} (Slots: ${course.availableSlots}/${course.maxSlots})`;
  
        const btn = document.createElement("button");
  
        if (enrolledCourseIds.includes(course.id)) {
          btn.textContent = "Already Enrolled";
          btn.disabled = true;
        } else if (course.availableSlots <= 0) {
          btn.textContent = "Full";
          btn.disabled = true;
        } else {
          btn.textContent = "Enroll";
          btn.onclick = async () => {
            try {
              const enrollRes = await fetch("http://localhost:8080/enrollments", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ courseId: course.id })
              });
  
              if (!enrollRes.ok) {
                const errText = await enrollRes.text();
                alert("Enrollment failed: " + errText);
                btn.disabled = true;
                btn.textContent = "Already Enrolled or Full";
                return;
              }
  
              alert("Enrolled successfully!");
              btn.disabled = true;
              btn.textContent = "Enrolled";
            } catch (err) {
              alert("Enrollment service is down.");
            }
          };
        }
  
        li.appendChild(btn);
        courseList.appendChild(li);
      });
  
    } catch (err) {
      console.error("Backend server unreachable:", err);
      if (statusMessage) {
        statusMessage.textContent = "⚠️ The course system is temporarily unavailable. Please try again later.";
      }
    }
  });
  