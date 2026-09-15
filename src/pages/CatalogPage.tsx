import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Unlock, BookOpen, Users, Clock, X, Send, CheckCircle, ChevronRight } from 'lucide-react';
import { Course } from '../types';

export default function CatalogPage() {
  const { courses, modules, lessons, currentUser, hasAccess, requestAccess, getProgress } = useApp();
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [requestSent, setRequestSent] = useState<Set<string>>(new Set());
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'main' | 'olymp'>('all');

  // Разделение курсов на категории
  const mainCourses = courses.filter(c => !c.title.startsWith('Олимпиадная'));
  const olympCourses = courses.filter(c => c.title.startsWith('Олимпиадная'));
  
  // Фильтрация по категории
  const categoryCourses = activeCategory === 'main' ? mainCourses 
    : activeCategory === 'olymp' ? olympCourses 
    : courses;
  
  // Сортировка: сначала доступные, потом закрытые
  const filteredCourses = [...categoryCourses].sort((a, b) => {
    const aAccess = hasAccess(a.id) ? 0 : 1;
    const bAccess = hasAccess(b.id) ? 0 : 1;
    return aAccess - bAccess;
  });

  // Функция для подсчёта уроков в курсе
  const getCourseLessonCount = (courseId: string) => {
    const courseModuleIds = modules.filter(m => m.courseId === courseId).map(m => m.id);
    return lessons.filter(l => courseModuleIds.includes(l.moduleId)).length;
  };

  const getCourseModuleCount = (courseId: string) => {
    return modules.filter(m => m.courseId === courseId).length;
  };

  const handleCourseClick = (courseId: string) => {
    if (hasAccess(courseId)) {
      navigate(`/course/${courseId}`);
    } else {
      setSelectedCourse(courseId);
      setShowRequestModal(true);
    }
  };

  const handleRequestAccess = (courseId: string) => {
    requestAccess(courseId);
    setRequestSent(prev => new Set([...prev, courseId]));
    setShowRequestModal(false);
  };

  const selectedCourseData = courses.find(c => c.id === selectedCourse);
  const accessibleCourses = filteredCourses.filter(c => hasAccess(c.id));
  const lockedCourses = filteredCourses.filter(c => !hasAccess(c.id));

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Каталог курсов</h1>
        <p className="text-slate-500">
          {currentUser?.role === 'teacher' 
            ? 'Доступные курсы отмечены зелёным. Для запроса доступа нажмите на закрытый курс.'
            : 'Полный каталог учебных программ школы'}
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeCategory === 'all'
              ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Все курсы ({courses.length})
        </button>
        <button
          onClick={() => setActiveCategory('main')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeCategory === 'main'
              ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Основные ({mainCourses.length})
        </button>
        <button
          onClick={() => setActiveCategory('olymp')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeCategory === 'olymp'
              ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Олимпиадные ({olympCourses.length})
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{filteredCourses.length}</p>
            <p className="text-sm text-slate-500">Курсов в категории</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Unlock className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{accessibleCourses.length}</p>
            <p className="text-sm text-slate-500">Доступно вам</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{lockedCourses.length}</p>
            <p className="text-sm text-slate-500">Закрыты</p>
          </div>
        </div>
      </div>

      {/* Доступные курсы */}
      {accessibleCourses.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-6 bg-emerald-500 rounded-full" />
            <h2 className="text-lg font-semibold text-slate-900">Доступные курсы</h2>
            <span className="text-sm text-slate-500">({accessibleCourses.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accessibleCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                accessible={true}
                progress={getProgress(course.id)}
                alreadyRequested={requestSent.has(course.id)}
                moduleCount={getCourseModuleCount(course.id)}
                lessonCount={getCourseLessonCount(course.id)}
                onClick={() => handleCourseClick(course.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Закрытые курсы */}
      {lockedCourses.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-6 bg-slate-300 rounded-full" />
            <h2 className="text-lg font-semibold text-slate-700">Закрытые курсы</h2>
            <span className="text-sm text-slate-500">({lockedCourses.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockedCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                accessible={false}
                progress={getProgress(course.id)}
                alreadyRequested={requestSent.has(course.id)}
                moduleCount={getCourseModuleCount(course.id)}
                lessonCount={getCourseLessonCount(course.id)}
                onClick={() => handleCourseClick(course.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Access Request Modal */}
      {showRequestModal && selectedCourseData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowRequestModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Lock className="w-6 h-6 text-amber-600" />
              </div>
              <button onClick={() => setShowRequestModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-2">Доступ к курсу закрыт</h3>
            <p className="text-slate-600 mb-1">Курс: <strong>{selectedCourseData.title}</strong></p>
            <p className="text-sm text-slate-500 mb-6">
              Только для назначенных преподавателей. Вы можете запросить доступ у администратора.
            </p>

            {requestSent.has(selectedCourseData.id) ? (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-emerald-700 font-medium">Заявка уже отправлена. Ожидайте одобрения.</span>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
                >
                  Отмена
                </button>
                <button
                  onClick={() => handleRequestAccess(selectedCourseData.id)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
                >
                  <Send className="w-4 h-4" />
                  Запросить доступ
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Компонент карточки курса
interface CourseCardProps {
  course: Course;
  accessible: boolean;
  progress: number;
  alreadyRequested: boolean;
  moduleCount: number;
  lessonCount: number;
  onClick: () => void;
}

function CourseCard({ course, accessible, progress, alreadyRequested, moduleCount, lessonCount, onClick }: CourseCardProps) {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-xl border overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
        accessible 
          ? 'border-slate-200 hover:border-blue-300' 
          : 'border-slate-200 opacity-70 hover:opacity-90'
      }`}
    >
      {/* Course preview banner */}
      <div className={`h-32 bg-gradient-to-br ${course.color} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-white font-semibold text-lg leading-tight drop-shadow-sm">
            {course.title}
          </h3>
        </div>
        {!accessible && (
          <div className="absolute top-3 right-3">
            <div className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
        {accessible && (
          <div className="absolute top-3 right-3">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Unlock className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Course info */}
      <div className="p-4">
        <p className="text-sm text-slate-600 line-clamp-2 mb-3">{course.description}</p>
        
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {moduleCount} {moduleCount === 3 ? 'года обучения' : 'модулей'}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {lessonCount} уроков
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Автор: {course.authorName}</span>
          {accessible && (
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-emerald-600 font-medium">{progress}%</span>
            </div>
          )}
        </div>

        {accessible && (
          <div className="mt-3 flex items-center text-sm text-blue-600 font-medium group-hover:gap-2 transition-all">
            <span>Перейти к курсу</span>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
          </div>
        )}

        {!accessible && alreadyRequested && (
          <div className="mt-3 flex items-center gap-1.5 text-sm text-amber-600">
            <Clock className="w-3.5 h-3.5" />
            <span>Заявка отправлена</span>
          </div>
        )}
      </div>
    </div>
  );
}
