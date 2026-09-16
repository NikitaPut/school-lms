package com.azimov.lms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserCourseAccessRepository extends JpaRepository<UserCourseAccess, UserCourseAccess.UserCourseAccessId> {
    
    List<UserCourseAccess> findByUserId(String userId);
    
    List<UserCourseAccess> findByCourseId(String courseId);
    
    boolean existsByUserIdAndCourseId(String userId, String courseId);
}
