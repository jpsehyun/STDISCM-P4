package com.enrollment.backend.controller;

import com.enrollment.backend.dto.GradeUploadRequest;
import com.enrollment.backend.model.Enrollment;
import com.enrollment.backend.repository.EnrollmentRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/grades")
@CrossOrigin(origins = "*")
public class GradeController {

    private final EnrollmentRepository enrollmentRepository;

    @Value("${jwt.secret}")
    private String secretKey;

    public GradeController(EnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadGrade(@RequestBody GradeUploadRequest request, HttpServletRequest httpRequest) {
        String username = extractUsername(httpRequest);
        if (!"faculty".equals(username)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        Optional<Enrollment> enrollmentOpt = enrollmentRepository.findById(request.getEnrollmentId());
        if (enrollmentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Enrollment not found"));
        }

        Enrollment enrollment = enrollmentOpt.get();
        enrollment.setGrade(request.getGrade());
        enrollmentRepository.save(enrollment);

        return ResponseEntity.ok(Map.of("message", "Grade uploaded successfully"));
    }

    @PutMapping("/{enrollmentId}")
    public ResponseEntity<?> updateGrade(@PathVariable Long enrollmentId, @RequestBody Map<String, String> request) {
        Optional<Enrollment> opt = enrollmentRepository.findById(enrollmentId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Enrollment enrollment = opt.get();
        enrollment.setGrade(request.get("grade"));
        enrollmentRepository.save(enrollment);
        return ResponseEntity.ok(Map.of("message", "Grade updated"));
    }

    private String extractUsername(HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace("Bearer ", "");
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }
}
