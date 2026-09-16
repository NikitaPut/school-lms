package com.azimov.lms.controller;

import com.azimov.lms.dto.CourseDto;
import com.azimov.lms.service.CourseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalog")
@RequiredArgsConstructor
@Slf4j
public class CatalogController {
    
    private final CourseService courseService;
    
    /**
     * Получить список всех курсов для текущего пользователя
     * GET /api/catalog/courses?userId=u3
     * 
     * Временное решение: userId передаётся как query параметр
     * В продакшене будет браться из JWT токена
     */
    @GetMapping("/courses")
    public ResponseEntity<List<CourseDto>> getAllCourses(
            @RequestParam(defaultValue = "u3") String userId) {
        
        log.info("Запрос каталога курсов для пользователя: {}", userId);
        
        List<CourseDto> courses = courseService.getAllCourses(userId);
        
        log.info("Возвращено {} курсов", courses.size());
        
        return ResponseEntity.ok(courses);
    }
    
    /**
     * Получить конкретный курс
     * GET /api/catalog/courses/{courseId}?userId=u3
     */
    @GetMapping("/courses/{courseId}")
    public ResponseEntity<CourseDto> getCourseById(
            @PathVariable String courseId,
            @RequestParam(defaultValue = "u3") String userId) {
        
        log.info("Запрос курса {} для пользователя {}", courseId, userId);
        
        CourseDto course = courseService.getCourseById(courseId, userId);
        
        return ResponseEntity.ok(course);
    }
}
