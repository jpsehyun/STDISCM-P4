package com.enrollment.backend.controller;

import com.enrollment.backend.model.Course;
import com.enrollment.backend.model.Enrollment;
import com.enrollment.backend.repository.CourseRepository;
import com.enrollment.backend.repository.EnrollmentRepository;
import com.enrollment.backend.dto.EnrollmentWithCourseDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/enrollments")
@CrossOrigin(origins = "*")
public class EnrollmentController {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    @Value("${jwt.secret}")
    private String secretKey;

    public EnrollmentController(EnrollmentRepository enrollmentRepository, CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
    }

    @PostMapping
    public ResponseEntity<?> enroll(@RequestBody Enrollment request, HttpServletRequest httpRequest) {
        Long userId = extractUserId(httpRequest);
        Long courseId = request.getCourseId();

        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Course not found"));
        }

        Course course = courseOpt.get();

        if (course.getAvailableSlots() <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Course is full"));
        }

        if (enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Already enrolled"));
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setUserId(userId);
        enrollment.setCourseId(courseId);
        enrollment.setGrade(null);
        enrollmentRepository.save(enrollment);

        course.setAvailableSlots(course.getAvailableSlots() - 1);
        courseRepository.save(course);

        return ResponseEntity.ok(Map.of("message", "Enrolled successfully"));
    }

    @GetMapping
    public List<EnrollmentWithCourseDTO> getMyEnrollments(HttpServletRequest request) {
        Long userId = extractUserId(request);
        List<Enrollment> enrollments = enrollmentRepository.findByUserId(userId);

        return enrollments.stream().map(enrollment -> {
            Optional<Course> courseOpt = courseRepository.findById(enrollment.getCourseId().longValue());
            String title = courseOpt.map(Course::getTitle).orElse("Unknown Course");
            return new EnrollmentWithCourseDTO(
                    enrollment.getCourseId().longValue(),
                    title,
                    enrollment.getGrade()
            );
        }).toList();
    }

    @GetMapping("/course/{courseId}")
    public List<Enrollment> getEnrollmentsByCourse(@PathVariable Long courseId) {
        return enrollmentRepository.findByCourseId(courseId.intValue());
    }

    @PutMapping("/{enrollmentId}/grade")
    public ResponseEntity<?> updateGrade(@PathVariable Long enrollmentId, @RequestBody Map<String, String> request) {
        Optional<Enrollment> opt = enrollmentRepository.findById(enrollmentId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Enrollment enrollment = opt.get();
        enrollment.setGrade(request.get("grade"));
        enrollmentRepository.save(enrollment);
        return ResponseEntity.ok(Map.of("message", "Grade updated"));
    }

    private Long extractUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace("Bearer ", "");
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }
}