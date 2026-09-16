package com.azimov.lms.dto;

import com.azimov.lms.model.Course;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDto {
    private String id;
    private String title;
    private String description;
    private String previewUrl;
    private String authorId;
    private String authorName;
    private String status;
    private Integer moduleCount;
    private Integer lessonCount;
    private String color;
    private Boolean hasAccess;
    
    public static CourseDto fromEntity(Course course) {
        return CourseDto.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .previewUrl(course.getPreviewUrl())
                .authorId(course.getAuthorId())
                .authorName(course.getAuthorName())
                .status(course.getStatus().name())
                .moduleCount(course.getModuleCount())
                .lessonCount(course.getLessonCount())
                .color(course.getColor())
                .build();
    }
}
