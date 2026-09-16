package com.azimov.lms.repository;

import com.azimov.lms.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
    
    List<Course> findByStatus(Course.CourseStatus status);
    
    List<Course> findByStatusOrderByCreatedAtDesc(Course.CourseStatus status);
}
