package com.enrollment.backend.controller;

import com.enrollment.backend.model.Course;
import com.enrollment.backend.repository.CourseRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "*")  // to allow browser fetch from frontend
public class CourseController {

    private final CourseRepository courseRepository;

    public CourseController(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @GetMapping
    public List<Course> getCourses() {
        return courseRepository.findAll();
    }
}