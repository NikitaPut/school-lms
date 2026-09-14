import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { 
  ArrowLeft, BookOpen, CheckCircle, Circle, ChevronDown, ChevronRight, 
  FileText, Link2, Play, Shield, Eye, AlertTriangle, Clock, Download
} from 'lucide-react';

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses, modules, lessons, hasAccess, currentUser, markLessonComplete, completedLessons, addAuditEntry } = useApp();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [showWatermark, setShowWatermark] = useState(true);

  const course = courses.find(c => c.id === courseId);
  const courseModules = modules.filter(m => m.courseId === courseId).sort((a, b) => a.orderIndex - b.orderIndex);
  const courseLessons = lessons.filter(l => courseModules.some(m => m.id === l.moduleId));
  const currentLesson = courseLessons.find(l => l.id === activeLesson);

  useEffect(() => {
    if (courseId && hasAccess(courseId)) {
      addAuditEntry('ENTER_COURSE', 'course', courseId);
    }
    if (courseModules.length > 0 && !expandedModule) {
      setExpandedModule(courseModules[0].id);
    }
  }, [courseId]);

  // Block right-click for content protection
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  if (!course) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Курс не найден</p>
        <button onClick={() => navigate('/catalog')} className="mt-4 text-blue-600 hover:underline">
          Вернуться в каталог
        </button>
      </div>
    );
  }

  if (!hasAccess(courseId!)) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Доступ запрещён</h2>
        <p className="text-slate-500 mb-4">У вас нет прав для просмотра этого курса.</p>
        <button onClick={() => navigate('/catalog')} className="text-blue-600 hover:underline">
          Вернуться в каталог
        </button>
      </div>
    );
  }

  const isLessonCompleted = (lessonId: string) => {
    return currentUser && completedLessons.some(cl => cl.userId === currentUser.id && cl.lessonId === lessonId);
  };

  const handleMarkComplete = (lessonId: string) => {
    markLessonComplete(lessonId);
  };

  const totalLessons = courseLessons.length;
  const completedCount = courseLessons.filter(l => isLessonCompleted(l.id)).length;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="relative">
      {/* Watermark overlay */}
      {showWatermark && currentUser && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden opacity-[0.05]">
          <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-32 rotate-[-15deg] scale-150">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="text-blue-900 text-base font-bold whitespace-nowrap">
                  АЗИМОВ • azimovclub.com
                </div>
                <div className="text-slate-900 text-sm font-medium whitespace-nowrap">
                  {currentUser.fullName} • {currentUser.email}
                </div>
                <div className="text-slate-700 text-xs whitespace-nowrap">
                  {new Date().toLocaleDateString('ru-RU')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DRM Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-blue-800 font-medium">Защищённый контент школы «Азимов»</p>
          <p className="text-xs text-blue-700 mt-0.5">
            Материалы курса являются собственностью школы «Азимов» и защищены от копирования. 
            Все действия записываются в журнал аудита. На каждом документе отображается персональный водяной знак.
          </p>
        </div>
        <button 
          onClick={() => setShowWatermark(!showWatermark)}
          className="text-xs text-blue-700 hover:text-blue-900 underline shrink-0"
        >
          {showWatermark ? 'Скрыть WM' : 'Показать WM'}
        </button>
      </div>

      {/* Course header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => navigate('/catalog')}
          className="p-2 hover:bg-slate-100 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900">{course.title}</h1>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs text-slate-500">{progress}% пройдено</span>
            </div>
            <span className="text-xs text-slate-400">{completedCount} из {totalLessons} уроков</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar: Modules & Lessons */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Содержание курса
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {courseModules.map(module => {
                const moduleLessons = courseLessons.filter(l => l.moduleId === module.id).sort((a, b) => a.orderIndex - b.orderIndex);
                const isExpanded = expandedModule === module.id;
                const moduleCompleted = moduleLessons.filter(l => isLessonCompleted(l.id)).length;

                return (
                  <div key={module.id}>
                    <button
                      onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                      className="w-full p-4 flex items-center gap-3 hover:bg-slate-50 transition text-left"
                    >
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${
                        moduleCompleted === moduleLessons.length && moduleLessons.length > 0
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{module.title}</p>
                        <p className="text-xs text-slate-500">{moduleCompleted}/{moduleLessons.length} уроков</p>
                      </div>
                    </button>
                    
                    {isExpanded && (
                      <div className="bg-slate-50/50">
                        {moduleLessons.map(lesson => {
                          const completed = isLessonCompleted(lesson.id);
                          const isActive = activeLesson === lesson.id;
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => setActiveLesson(lesson.id)}
                              className={`w-full pl-14 pr-4 py-3 flex items-center gap-3 text-left transition ${
                                isActive ? 'bg-blue-50 border-l-2 border-blue-500' : 'hover:bg-slate-100'
                              }`}
                            >
                              {completed ? (
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                              )}
                              <span className={`text-sm truncate ${isActive ? 'text-blue-700 font-medium' : 'text-slate-700'}`}>
                                {lesson.title}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main content: Lesson viewer */}
        <div className="lg:col-span-2">
          {currentLesson ? (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900 mb-1">{currentLesson.title}</h2>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    Просмотр защищён
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date().toLocaleString('ru-RU')}
                  </span>
                </div>
              </div>

              {/* Lesson content with DRM */}
              <div 
                className="p-6 prose prose-slate max-w-none select-none"
                onCopy={e => e.preventDefault()}
                style={{ userSelect: 'none' }}
                dangerouslySetInnerHTML={{ __html: currentLesson.content }}
              />

              {/* Materials */}
              {currentLesson.materials.length > 0 && (
                <div className="px-6 pb-6">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Материалы урока</h3>
                  <div className="space-y-2">
                    {currentLesson.materials.map(mat => (
                      <div key={mat.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        {mat.type === 'pdf' && <FileText className="w-5 h-5 text-red-500" />}
                        {mat.type === 'video' && <Play className="w-5 h-5 text-blue-500" />}
                        {mat.type === 'link' && <Link2 className="w-5 h-5 text-emerald-500" />}
                        {mat.type === 'text' && <FileText className="w-5 h-5 text-slate-500" />}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-700">{mat.title}</p>
                          <p className="text-xs text-slate-500">
                            {mat.type === 'pdf' ? 'PDF документ' : 
                             mat.type === 'video' ? 'Видео' :
                             mat.type === 'link' ? 'Внешняя ссылка' : 'Текстовый материал'}
                          </p>
                        </div>
                        {mat.downloadable ? (
                          <button 
                            onClick={() => {
                              if (mat.content && mat.content.startsWith('http')) {
                                window.open(mat.content, '_blank');
                              } else {
                                alert('Скачивание файла: ' + mat.title + '\n\nВ продакшен-версии здесь будет presigned URL с TTL 60 секунд.');
                              }
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 transition"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Скачать
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded-lg">
                            <Shield className="w-3.5 h-3.5 text-amber-600" />
                            <span className="text-xs text-amber-700 font-medium">Только просмотр</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Complete button */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                {isLessonCompleted(currentLesson.id) ? (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Урок пройден</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleMarkComplete(currentLesson.id)}
                    className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Отметить как пройденный
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">Выберите урок</h3>
              <p className="text-sm text-slate-500">Выберите урок из списка слева для просмотра материалов</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
