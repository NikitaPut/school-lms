import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, Course, AccessRequest, AuditLogEntry, Module, Lesson, Material } from '../types';
import { mockUsers, mockCourses, mockAccessRequests, mockAuditLog, mockUserCourseAccess, mockModules, mockLessons } from '../data/mockData';

interface AppState {
  currentUser: User | null;
  users: User[];
  courses: Course[];
  modules: Module[];
  lessons: Lesson[];
  accessRequests: AccessRequest[];
  auditLog: AuditLogEntry[];
  userCourseAccess: { userId: string; courseId: string; grantedBy: string; grantedAt: string }[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (fullName: string, email: string, password: string) => { success: boolean; error?: string };
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  revokeAccess: (userId: string, courseId: string) => void;
  grantAccess: (userId: string, courseId: string) => void;
  hasAccess: (courseId: string) => boolean;
  requestAccess: (courseId: string) => void;
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
  addAuditEntry: (action: string, resourceType: string, resourceId: string) => void;
  getProgress: (courseId: string) => number;
  completedLessons: { userId: string; lessonId: string }[];
  markLessonComplete: (lessonId: string) => void;
  // Course CRUD
  addCourse: (title: string, description: string, color: string) => void;
  deleteCourse: (courseId: string) => void;
  // Module CRUD
  addModule: (courseId: string, title: string) => void;
  deleteModule: (moduleId: string) => void;
  // Lesson CRUD
  addLesson: (moduleId: string, title: string, content: string) => void;
  updateLesson: (lessonId: string, updates: Partial<Lesson>) => void;
  deleteLesson: (lessonId: string) => void;
  // Material CRUD
  addMaterial: (lessonId: string, type: Material['type'], title: string, content: string, downloadable?: boolean) => void;
  updateMaterial: (materialId: string, updates: Partial<Material>) => void;
  deleteMaterial: (materialId: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [modules, setModules] = useState<Module[]>(mockModules);
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
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
    const user = users.find(u => u.email === email);
    if (user) {
      // Проверяем статус пользователя
      if (user.status === 'pending') {
        alert('Ваш аккаунт ещё не активирован. Ожидайте подтверждения администратора.');
        return false;
      }
      if (user.status === 'rejected') {
        alert('Ваша регистрация была отклонена. Обратитесь к администратору.');
        return false;
      }
      setCurrentUser(user);
      return true;
    }
    return false;
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const register = useCallback((fullName: string, email: string, _password: string): { success: boolean; error?: string } => {
    // Проверяем, не зарегистрирован ли уже пользователь
    if (users.some(u => u.email === email)) {
      return { success: false, error: 'Пользователь с таким email уже зарегистрирован' };
    }

    // Создаём нового пользователя со статусом "pending"
    const newUser: User = {
      id: `u${Date.now()}`,
      email,
      fullName,
      role: 'teacher', // По умолчанию все новые пользователи - преподаватели
      status: 'pending',
      registeredAt: new Date().toISOString(),
    };

    setUsers(prev => [...prev, newUser]);
    
    return { success: true };
  }, [users]);

  const approveUser = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'active' as const } : u));
  }, []);

  const rejectUser = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'rejected' as const } : u));
  }, []);

  const revokeAccess = useCallback((userId: string, courseId: string) => {
    setUserCourseAccess(prev => prev.filter(a => !(a.userId === userId && a.courseId === courseId)));
  }, []);

  const grantAccess = useCallback((userId: string, courseId: string) => {
    const existing = userCourseAccess.find(a => a.userId === userId && a.courseId === courseId);
    if (!existing && currentUser) {
      setUserCourseAccess(prev => [...prev, {
        userId,
        courseId,
        grantedBy: currentUser.id,
        grantedAt: new Date().toISOString()
      }]);
    }
  }, [userCourseAccess, currentUser]);

  const hasAccess = useCallback((courseId: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'superadmin' || currentUser.role === 'methodist') return true;
    return userCourseAccess.some(a => a.userId === currentUser.id && a.courseId === courseId);
  }, [currentUser, userCourseAccess]);

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
  }, [currentUser, courses, addAuditEntry]);

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
  }, [currentUser, accessRequests, addAuditEntry]);

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
  }, [currentUser, accessRequests, addAuditEntry]);

  const getProgress = useCallback((courseId: string): number => {
    if (!currentUser) return 0;
    const courseLessonsMap: { [key: string]: string[] } = {
      'c1': ['l1', 'l2', 'l3', 'l4', 'l5'],
      'c2': [],
      'c3': ['l6', 'l7', 'l8'],
      'c4': ['l11', 'l12'],
      'c5': ['l9', 'l10'],
      'c6': [],
      'c7': [],
      'c8': [],
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
  }, [currentUser, addAuditEntry]);

  // === COURSE CRUD ===
  const addCourse = useCallback((title: string, description: string, color: string) => {
    const newCourse: Course = {
      id: `c${Date.now()}`,
      title,
      description,
      previewUrl: '',
      authorId: currentUser?.id || 'u2',
      authorName: currentUser?.fullName || 'Методист',
      status: 'ACTIVE',
      moduleCount: 0,
      lessonCount: 0,
      color,
    };
    setCourses(prev => [...prev, newCourse]);
    addAuditEntry('CREATE_COURSE', 'course', newCourse.id);
  }, [currentUser, addAuditEntry]);

  const deleteCourse = useCallback((courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    setModules(prev => prev.filter(m => m.courseId !== courseId));
    const moduleIds = modules.filter(m => m.courseId === courseId).map(m => m.id);
    setLessons(prev => prev.filter(l => !moduleIds.includes(l.moduleId)));
    addAuditEntry('DELETE_COURSE', 'course', courseId);
  }, [modules, addAuditEntry]);

  // === MODULE CRUD ===
  const addModule = useCallback((courseId: string, title: string) => {
    const courseModules = modules.filter(m => m.courseId === courseId);
    const newModule: Module = {
      id: `m${Date.now()}`,
      courseId,
      title,
      orderIndex: courseModules.length + 1,
    };
    setModules(prev => [...prev, newModule]);
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, moduleCount: c.moduleCount + 1 } : c));
    addAuditEntry('CREATE_MODULE', 'module', newModule.id);
  }, [modules, addAuditEntry]);

  const deleteModule = useCallback((moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;
    setModules(prev => prev.filter(m => m.id !== moduleId));
    setLessons(prev => prev.filter(l => l.moduleId !== moduleId));
    setCourses(prev => prev.map(c => c.id === module.courseId ? { ...c, moduleCount: Math.max(0, c.moduleCount - 1) } : c));
    addAuditEntry('DELETE_MODULE', 'module', moduleId);
  }, [modules, addAuditEntry]);

  // === LESSON CRUD ===
  const addLesson = useCallback((moduleId: string, title: string, content: string) => {
    const moduleLessons = lessons.filter(l => l.moduleId === moduleId);
    const newLesson: Lesson = {
      id: `l${Date.now()}`,
      moduleId,
      title,
      orderIndex: moduleLessons.length + 1,
      content,
      materials: [],
    };
    setLessons(prev => [...prev, newLesson]);
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      setCourses(prev => prev.map(c => c.id === module.courseId ? { ...c, lessonCount: c.lessonCount + 1 } : c));
    }
    addAuditEntry('CREATE_LESSON', 'lesson', newLesson.id);
  }, [lessons, modules, addAuditEntry]);

  const updateLesson = useCallback((lessonId: string, updates: Partial<Lesson>) => {
    setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, ...updates } : l));
  }, []);

  const deleteLesson = useCallback((lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    setLessons(prev => prev.filter(l => l.id !== lessonId));
    const module = modules.find(m => m.id === lesson.moduleId);
    if (module) {
      setCourses(prev => prev.map(c => c.id === module.courseId ? { ...c, lessonCount: Math.max(0, c.lessonCount - 1) } : c));
    }
    addAuditEntry('DELETE_LESSON', 'lesson', lessonId);
  }, [lessons, modules, addAuditEntry]);

  // === MATERIAL CRUD ===
  const addMaterial = useCallback((lessonId: string, type: Material['type'], title: string, content: string, downloadable: boolean = false) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    const newMaterial: Material = {
      id: `mat${Date.now()}`,
      lessonId,
      type,
      title,
      content,
      orderIndex: lesson.materials.length + 1,
      downloadable,
    };
    setLessons(prev => prev.map(l => 
      l.id === lessonId ? { ...l, materials: [...l.materials, newMaterial] } : l
    ));
    addAuditEntry('ADD_MATERIAL', 'material', newMaterial.id);
  }, [lessons, addAuditEntry]);

  const updateMaterial = useCallback((materialId: string, updates: Partial<Material>) => {
    setLessons(prev => prev.map(l => ({
      ...l,
      materials: l.materials.map(m => m.id === materialId ? { ...m, ...updates } : m),
    })));
  }, []);

  const deleteMaterial = useCallback((materialId: string) => {
    setLessons(prev => prev.map(l => ({
      ...l,
      materials: l.materials.filter(m => m.id !== materialId),
    })));
    addAuditEntry('DELETE_MATERIAL', 'material', materialId);
  }, [addAuditEntry]);

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      courses,
      modules,
      lessons,
      accessRequests,
      auditLog,
      userCourseAccess,
      isAuthenticated: !!currentUser,
      login,
      logout,
      register,
      approveUser,
      rejectUser,
      revokeAccess,
      grantAccess,
      hasAccess,
      requestAccess,
      approveRequest,
      rejectRequest,
      addAuditEntry,
      getProgress,
      completedLessons,
      markLessonComplete,
      addCourse,
      deleteCourse,
      addModule,
      deleteModule,
      addLesson,
      updateLesson,
      deleteLesson,
      addMaterial,
      updateMaterial,
      deleteMaterial,
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
