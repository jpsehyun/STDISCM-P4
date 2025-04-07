package com.enrollment.backend.repository;

import com.enrollment.backend.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByUserId(Long userId);
    List<Enrollment> findByCourseId(Integer courseId);

    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
    
}
