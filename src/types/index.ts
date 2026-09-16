export type UserRole = 'superadmin' | 'methodist' | 'teacher';
export type UserStatus = 'active' | 'pending' | 'rejected';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  status: UserStatus;
  registeredAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  previewUrl: string;
  authorId: string;
  authorName: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  moduleCount: number;
  lessonCount: number;
  color: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  orderIndex: number;
  content: string;
  materials: Material[];
}

export interface Material {
  id: string;
  lessonId: string;
  type: 'text' | 'pdf' | 'video' | 'link';
  title: string;
  content: string;
  fileUrl?: string;
  orderIndex: number;
  downloadable: boolean;
}

export interface AccessRequest {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  ip: string;
  userAgent: string;
  createdAt: string;
}

export interface Question {
  id: string;
  lessonId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
  answers: Answer[];
}

export interface Answer {
  id: string;
  questionId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface UserCourseAccess {
  userId: string;
  courseId: string;
  grantedBy: string;
  grantedAt: string;
}
