package com.azimov.lms.service;

import com.azimov.lms.dto.CourseDto;
import com.azimov.lms.model.Course;
import com.azimov.lms.repository.CourseRepository;
import com.azimov.lms.repository.UserCourseAccessRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseService {
    
    private final CourseRepository courseRepository;
    private final UserCourseAccessRepository userCourseAccessRepository;
    
    @Transactional(readOnly = true)
    public List<CourseDto> getAllCourses(String userId) {
        log.debug("Получение списка курсов для пользователя: {}", userId);
        
        // Получаем все активные курсы
        List<Course> courses = courseRepository.findByStatusOrderByCreatedAtDesc(Course.CourseStatus.ACTIVE);
        
        // Получаем доступы пользователя
        Set<String> accessibleCourseIds = userCourseAccessRepository.findByUserId(userId)
                .stream()
                .map(access -> access.getCourseId())
                .collect(Collectors.toSet());
        
        // Маппим в DTO и устанавливаем флаг hasAccess
        return courses.stream()
                .map(course -> {
                    CourseDto dto = CourseDto.fromEntity(course);
                    dto.setHasAccess(accessibleCourseIds.contains(course.getId()));
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public CourseDto getCourseById(String courseId, String userId) {
        log.debug("Получение курса {} для пользователя {}", courseId, userId);
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Курс не найден: " + courseId));
        
        CourseDto dto = CourseDto.fromEntity(course);
        
        // Проверяем доступ
        boolean hasAccess = userCourseAccessRepository.existsByUserIdAndCourseId(userId, courseId);
        dto.setHasAccess(hasAccess);
        
        return dto;
    }
}
