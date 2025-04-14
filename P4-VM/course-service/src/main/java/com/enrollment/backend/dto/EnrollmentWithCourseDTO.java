package com.enrollment.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EnrollmentWithCourseDTO {
    private Long courseId;
    private String courseTitle;
    private String grade;
}
