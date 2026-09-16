package com.azimov.lms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    
    @Id
    private String id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String previewUrl;
    
    private String authorId;
    
    private String authorName;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CourseStatus status;
    
    private Integer moduleCount;
    
    private Integer lessonCount;
    
    private String color;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = CourseStatus.ACTIVE;
        if (moduleCount == null) moduleCount = 0;
        if (lessonCount == null) lessonCount = 0;
    }
    
    public enum CourseStatus {
        ACTIVE, DRAFT, ARCHIVED
    }
}
