import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { 
  ArrowLeft, BookOpen, CheckCircle, Circle, ChevronDown, ChevronRight, 
  FileText, Link2, Play, Shield, Eye, AlertTriangle, Clock, Download,
  MessageCircle, Send, User, Paperclip, Image, Video, X
} from 'lucide-react';
import { Attachment } from '../types';

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses, modules, lessons, questions, users, hasAccess, currentUser, markLessonComplete, completedLessons, addAuditEntry, addQuestion, addAnswer } = useApp();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [showWatermark, setShowWatermark] = useState(true);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState<{ [key: string]: string }>({});
  const [questionAttachments, setQuestionAttachments] = useState<Attachment[]>([]);
  const [answerAttachments, setAnswerAttachments] = useState<{ [key: string]: Attachment[] }>({});
  const [mediaViewer, setMediaViewer] = useState<{ attachment: Attachment; visible: boolean } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'question' | 'answer', questionId?: string) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const attachment: Attachment = {
          id: `att${Date.now()}_${Math.random()}`,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          url: reader.result as string,
          name: file.name,
        };

        if (target === 'question') {
          setQuestionAttachments(prev => [...prev, attachment]);
        } else if (questionId) {
          setAnswerAttachments(prev => ({
            ...prev,
            [questionId]: [...(prev[questionId] || []), attachment],
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeQuestionAttachment = (id: string) => {
    setQuestionAttachments(prev => prev.filter(att => att.id !== id));
  };

  const removeAnswerAttachment = (questionId: string, id: string) => {
    setAnswerAttachments(prev => ({
      ...prev,
      [questionId]: (prev[questionId] || []).filter(att => att.id !== id),
    }));
  };

  const openMediaViewer = (attachment: Attachment) => {
    setMediaViewer({ attachment, visible: true });
  };

  const closeMediaViewer = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setMediaViewer(null);
  };

  // Автоматический запуск видео при открытии модального окна
  useEffect(() => {
    if (mediaViewer?.visible && mediaViewer.attachment.type === 'video' && videoRef.current) {
      const playVideo = async () => {
        try {
          await videoRef.current?.play();
        } catch (error) {
          console.log('Автозапуск заблокирован, пользователь должен нажать Play');
        }
      };
      // Небольшая задержка для загрузки видео
      setTimeout(playVideo, 100);
    }
  }, [mediaViewer]);

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

              {/* Questions & Answers */}
              <div className="px-6 pb-6 border-t border-slate-100">
                <div className="pt-6">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                    Вопросы и ответы
                    {questions.filter(q => q.lessonId === currentLesson.id).length > 0 && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {questions.filter(q => q.lessonId === currentLesson.id).length}
                      </span>
                    )}
                  </h3>

                  {/* Existing questions */}
                  <div className="space-y-4 mb-6">
                    {questions
                      .filter(q => q.lessonId === currentLesson.id)
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map(question => (
                        <div key={question.id} className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                          {/* Question */}
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-slate-900">{question.userName}</span>
                                <span className="text-xs text-slate-400">
                                  {new Date(question.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                              <p className="text-sm text-slate-700">{question.text}</p>
                              
                              {/* Question attachments */}
                              {question.attachments.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {question.attachments.map(att => (
                                    <div key={att.id} className="relative group">
                                      {att.type === 'image' ? (
                                        <img 
                                          src={att.url} 
                                          alt={att.name}
                                          className="w-24 h-24 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition"
                                          onClick={() => openMediaViewer(att)}
                                        />
                                      ) : (
                                        <div 
                                          className="relative w-32 h-24 rounded-lg border border-slate-200 overflow-hidden cursor-pointer hover:opacity-90 transition"
                                          onClick={() => openMediaViewer(att)}
                                        >
                                          <video 
                                            src={att.url}
                                            className="w-full h-full object-cover"
                                          />
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <Play className="w-8 h-8 text-white" />
                                          </div>
                                        </div>
                                      )}
                                      <div className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded truncate">
                                        {att.name}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Answers */}
                          {question.answers.length > 0 && (
                            <div className="ml-11 space-y-3 mb-3">
                              {question.answers.map(answer => (
                                <div key={answer.id} className="flex items-start gap-3">
                                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                    <User className="w-3.5 h-3.5 text-emerald-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-medium text-slate-900">{answer.userName}</span>
                                      {users.find(u => u.id === answer.userId)?.role === 'methodist' && (
                                        <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                                          Методист
                                        </span>
                                      )}
                                      <span className="text-xs text-slate-400">
                                        {new Date(answer.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                                      </span>
                                    </div>
                                    <p className="text-sm text-slate-700">{answer.text}</p>
                                    
                                    {/* Answer attachments */}
                                    {answer.attachments.length > 0 && (
                                      <div className="mt-2 flex flex-wrap gap-2">
                                        {answer.attachments.map(att => (
                                          <div key={att.id} className="relative group">
                                            {att.type === 'image' ? (
                                              <img 
                                                src={att.url} 
                                                alt={att.name}
                                                className="w-24 h-24 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition"
                                                onClick={() => openMediaViewer(att)}
                                              />
                                            ) : (
                                              <div 
                                                className="relative w-32 h-24 rounded-lg border border-slate-200 overflow-hidden cursor-pointer hover:opacity-90 transition"
                                                onClick={() => openMediaViewer(att)}
                                              >
                                                <video 
                                                  src={att.url}
                                                  className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                  <Play className="w-8 h-8 text-white" />
                                                </div>
                                              </div>
                                            )}
                                            <div className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded truncate">
                                              {att.name}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Answer input */}
                          <div className="ml-11">
                            <div className="flex gap-2 mb-2">
                              <input
                                type="text"
                                value={newAnswer[question.id] || ''}
                                onChange={e => setNewAnswer({ ...newAnswer, [question.id]: e.target.value })}
                                placeholder="Ответить..."
                                className="flex-1 px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                              />
                              <button
                                onClick={() => {
                                  if (newAnswer[question.id]?.trim()) {
                                    addAnswer(question.id, newAnswer[question.id], answerAttachments[question.id] || []);
                                    setNewAnswer({ ...newAnswer, [question.id]: '' });
                                    setAnswerAttachments(prev => ({ ...prev, [question.id]: [] }));
                                  }
                                }}
                                disabled={!newAnswer[question.id]?.trim()}
                                className="px-3 py-1.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            
                            {/* Answer attachments preview */}
                            {answerAttachments[question.id]?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-2">
                                {answerAttachments[question.id].map(att => (
                                  <div key={att.id} className="relative group">
                                    {att.type === 'image' ? (
                                      <img src={att.url} alt={att.name} className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                                    ) : (
                                      <video src={att.url} className="w-20 h-16 object-cover rounded-lg border border-slate-200" />
                                    )}
                                    <button
                                      onClick={() => removeAnswerAttachment(question.id, att.id)}
                                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Answer attachment upload */}
                            <div className="flex items-center gap-2">
                              <label className="flex items-center gap-1 px-2 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer transition">
                                <Paperclip className="w-3.5 h-3.5" />
                                <span>Фото/Видео</span>
                                <input
                                  type="file"
                                  accept="image/*,video/*"
                                  multiple
                                  onChange={e => handleFileUpload(e, 'answer', question.id)}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* New question form */}
                  <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Задать вопрос</h4>
                    <div className="flex gap-2 mb-2">
                      <textarea
                        value={newQuestion}
                        onChange={e => setNewQuestion(e.target.value)}
                        placeholder="Введите ваш вопрос по этому уроку..."
                        rows={2}
                        className="flex-1 px-3 py-2 text-sm bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
                      />
                      <button
                        onClick={() => {
                          if (newQuestion.trim()) {
                            addQuestion(currentLesson.id, newQuestion, questionAttachments);
                            setNewQuestion('');
                            setQuestionAttachments([]);
                          }
                        }}
                        disabled={!newQuestion.trim()}
                        className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed self-end"
                      >
                        Отправить
                      </button>
                    </div>
                    
                    {/* Question attachments preview */}
                    {questionAttachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {questionAttachments.map(att => (
                          <div key={att.id} className="relative group">
                            {att.type === 'image' ? (
                              <img src={att.url} alt={att.name} className="w-16 h-16 object-cover rounded-lg border border-blue-200" />
                            ) : (
                              <video src={att.url} className="w-20 h-16 object-cover rounded-lg border border-blue-200" />
                            )}
                            <button
                              onClick={() => removeQuestionAttachment(att.id)}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Question attachment upload */}
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 px-3 py-1.5 text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded-lg cursor-pointer transition border border-blue-200">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>Прикрепить фото или видео</span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          onChange={e => handleFileUpload(e, 'question')}
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs text-blue-600">Можно прикрепить несколько файлов</span>
                    </div>
                  </div>
                </div>
              </div>

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

      {/* Media Viewer Modal */}
      {mediaViewer && mediaViewer.visible && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeMediaViewer}
        >
          <button
            onClick={closeMediaViewer}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="max-w-5xl max-h-[90vh] relative"
            onClick={e => e.stopPropagation()}
          >
      {mediaViewer.attachment.type === 'image' ? (
        <img 
          src={mediaViewer.attachment.url} 
          alt={mediaViewer.attachment.name}
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
        />
      ) : (
        <video 
          ref={videoRef}
          src={mediaViewer.attachment.url}
          className="max-w-full max-h-[85vh] rounded-lg"
          controls
          playsInline
          preload="auto"
          onLoadedData={() => console.log('Видео загружено')}
          onError={(e) => console.error('Ошибка загрузки видео:', e)}
          style={{ backgroundColor: '#000' }}
        >
          <source src={mediaViewer.attachment.url} type="video/mp4" />
          <source src={mediaViewer.attachment.url} type="video/webm" />
          Ваш браузер не поддерживает воспроизведение видео.
        </video>
      )}            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
              <p className="text-white text-sm font-medium">{mediaViewer.attachment.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
