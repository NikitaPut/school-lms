import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, Course, AccessRequest, AuditLogEntry } from '../types';
import { mockUsers, mockCourses, mockAccessRequests, mockAuditLog, mockUserCourseAccess } from '../data/mockData';

interface AppState {
  currentUser: User | null;
  courses: Course[];
  accessRequests: AccessRequest[];
  auditLog: AuditLogEntry[];
  userCourseAccess: { userId: string; courseId: string; grantedBy: string; grantedAt: string }[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasAccess: (courseId: string) => boolean;
  requestAccess: (courseId: string) => void;
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
  addAuditEntry: (action: string, resourceType: string, resourceId: string) => void;
  getProgress: (courseId: string) => number;
  completedLessons: { userId: string; lessonId: string }[];
  markLessonComplete: (lessonId: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [courses] = useState<Course[]>(mockCourses);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(mockAccessRequests);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(mockAuditLog);
  const [userCourseAccess, setUserCourseAccess] = useState<{ userId: string; courseId: string; grantedBy: string; grantedAt: string }[]>(mockUserCourseAccess);
  const [completedLessons, setCompletedLessons] = useState<{ userId: string; lessonId: string }[]>([
    { userId: 'u3', lessonId: 'l1' },
    { userId: 'u3', lessonId: 'l2' },
    { userId: 'u3', lessonId: 'l3' },
    { userId: 'u4', lessonId: 'l6' },
    { userId: 'u4', lessonId: 'l7' },
  ]);

  const login = useCallback((email: string, _password: string): boolean => {
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const hasAccess = useCallback((courseId: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'superadmin' || currentUser.role === 'methodist') return true;
    return userCourseAccess.some(a => a.userId === currentUser.id && a.courseId === courseId);
  }, [currentUser, userCourseAccess]);

  const requestAccess = useCallback((courseId: string) => {
    if (!currentUser) return;
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    const newRequest: AccessRequest = {
      id: `ar${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      courseId,
      courseTitle: course.title,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    setAccessRequests(prev => [...prev, newRequest]);
    addAuditEntry('REQUEST_ACCESS', 'course', courseId);
  }, [currentUser, courses]);

  const approveRequest = useCallback((requestId: string) => {
    if (!currentUser) return;
    const request = accessRequests.find(r => r.id === requestId);
    if (!request) return;

    setUserCourseAccess(prev => [...prev, { userId: request.userId, courseId: request.courseId, grantedBy: currentUser.id, grantedAt: new Date().toISOString() }]);
    setAccessRequests(prev => prev.map(r => 
      r.id === requestId 
        ? { ...r, status: 'APPROVED' as const, reviewedBy: currentUser.id, reviewedAt: new Date().toISOString() }
        : r
    ));
    addAuditEntry('GRANT_ACCESS', 'course', request.courseId);
  }, [currentUser, accessRequests]);

  const rejectRequest = useCallback((requestId: string) => {
    if (!currentUser) return;
    const request = accessRequests.find(r => r.id === requestId);
    if (!request) return;

    setAccessRequests(prev => prev.map(r => 
      r.id === requestId 
        ? { ...r, status: 'REJECTED' as const, reviewedBy: currentUser.id, reviewedAt: new Date().toISOString() }
        : r
    ));
    addAuditEntry('REJECT_ACCESS', 'course', request.courseId);
  }, [currentUser, accessRequests]);

  const addAuditEntry = useCallback((action: string, resourceType: string, resourceId: string) => {
    if (!currentUser) return;
    const entry: AuditLogEntry = {
      id: `a${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      action,
      resourceType,
      resourceId,
      ip: '192.168.1.' + Math.floor(Math.random() * 255),
      userAgent: navigator.userAgent.slice(0, 50),
      createdAt: new Date().toISOString(),
    };
    setAuditLog(prev => [entry, ...prev]);
  }, [currentUser]);

  const getProgress = useCallback((courseId: string): number => {
    if (!currentUser) return 0;
    // Подсчитываем прогресс по курсу на основе завершённых уроков
    // Для прототипа используем упрощённую логику
    const courseLessonsMap: { [key: string]: string[] } = {
      'c1': ['l1', 'l2', 'l3', 'l4', 'l5'], // Робототехника
      'c2': [], // Пайка
      'c3': ['l6', 'l7', 'l8'], // Python
      'c4': ['l11', 'l12'], // Minecraft
      'c5': ['l9', 'l10'], // Unity
      'c6': [], // Олимпиада Робототехника
      'c7': [], // Олимпиада Программирование
      'c8': [], // Олимпиада GameDev
    };
    
    const courseLessons = courseLessonsMap[courseId] || [];
    if (courseLessons.length === 0) return 0;
    
    const completed = completedLessons.filter(cl => 
      cl.userId === currentUser.id && courseLessons.includes(cl.lessonId)
    );
    return Math.min(100, Math.round((completed.length / courseLessons.length) * 100));
  }, [currentUser, completedLessons]);

  const markLessonComplete = useCallback((lessonId: string) => {
    if (!currentUser) return;
    setCompletedLessons(prev => {
      if (prev.some(cl => cl.userId === currentUser.id && cl.lessonId === lessonId)) return prev;
      return [...prev, { userId: currentUser.id, lessonId }];
    });
    addAuditEntry('COMPLETE_LESSON', 'lesson', lessonId);
  }, [currentUser]);

  return (
    <AppContext.Provider value={{
      currentUser,
      courses,
      accessRequests,
      auditLog,
      userCourseAccess,
      isAuthenticated: !!currentUser,
      login,
      logout,
      hasAccess,
      requestAccess,
      approveRequest,
      rejectRequest,
      addAuditEntry,
      getProgress,
      completedLessons,
      markLessonComplete,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
