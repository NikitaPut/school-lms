package com.azimov.lms.repository;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "user_course_access")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@IdClass(UserCourseAccess.UserCourseAccessId.class)
public class UserCourseAccess {
    
    @Id
    @Column(name = "user_id")
    private String userId;
    
    @Id
    @Column(name = "course_id")
    private String courseId;
    
    @Column(name = "granted_by")
    private String grantedBy;
    
    @Column(name = "granted_at", nullable = false)
    private LocalDateTime grantedAt;
    
    @PrePersist
    protected void onCreate() {
        if (grantedAt == null) {
            grantedAt = LocalDateTime.now();
        }
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserCourseAccessId implements Serializable {
        private String userId;
        private String courseId;
        
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            UserCourseAccessId that = (UserCourseAccessId) o;
            return Objects.equals(userId, that.userId) && Objects.equals(courseId, that.courseId);
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(userId, courseId);
        }
    }
}
