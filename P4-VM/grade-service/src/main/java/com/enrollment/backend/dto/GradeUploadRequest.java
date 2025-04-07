package com.enrollment.backend.dto;

import lombok.Data;

@Data
public class GradeUploadRequest {
    private Long enrollmentId;
    private String grade;
}