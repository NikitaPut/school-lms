import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { 
  Plus, Trash2, Edit3, Save, X, ChevronDown, ChevronRight, 
  BookOpen, FileText, Link2, Play, Upload, ArrowLeft, FolderPlus, 
  FilePlus, CheckCircle, AlertCircle, GripVertical
} from 'lucide-react';

type ViewType = 'courses' | 'course-detail' | 'lesson-editor';

export default function ManageCoursesPage() {
  const { currentUser, courses, addCourse, deleteCourse, addModule, deleteModule, addLesson, updateLesson, deleteLesson, addMaterial, deleteMaterial, modules, lessons } = useApp();
  
  const [view, setView] = useState<ViewType>('courses');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  
  // Course form
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', color: 'from-blue-500 to-indigo-600' });
  
  // Module form
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [moduleForm, setModuleForm] = useState({ title: '' });
  
  // Lesson form
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [lessonForm, setLessonForm] = useState({ title: '', content: '' });
  
  // Material form
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [materialForm, setMaterialForm] = useState({ title: '', type: 'text' as 'text' | 'pdf' | 'video' | 'link', content: '' });

  if (!currentUser || (currentUser.role !== 'superadmin' && currentUser.role !== 'methodist')) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Доступ запрещён</h2>
        <p className="text-slate-500">Эта страница доступна только методистам и администраторам.</p>
      </div>
    );
  }

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const courseModules = modules.filter(m => m.courseId === selectedCourseId).sort((a, b) => a.orderIndex - b.orderIndex);
  const selectedLesson = lessons.find(l => l.id === selectedLessonId);

  const handleCreateCourse = () => {
    if (!courseForm.title.trim()) return;
    addCourse(courseForm.title, courseForm.description, courseForm.color);
    setCourseForm({ title: '', description: '', color: 'from-blue-500 to-indigo-600' });
    setShowCourseForm(false);
  };

  const handleCreateModule = () => {
    if (!moduleForm.title.trim() || !selectedCourseId) return;
    addModule(selectedCourseId, moduleForm.title);
    setModuleForm({ title: '' });
    setShowModuleForm(false);
  };

  const handleCreateLesson = () => {
    if (!lessonForm.title.trim() || !expandedModule) return;
    addLesson(expandedModule, lessonForm.title, lessonForm.content);
    setLessonForm({ title: '', content: '' });
    setShowLessonForm(false);
  };

  const handleCreateMaterial = () => {
    if (!materialForm.title.trim() || !selectedLessonId) return;
    addMaterial(selectedLessonId, materialForm.type, materialForm.title, materialForm.content);
    setMaterialForm({ title: '', type: 'text', content: '' });
    setShowMaterialForm(false);
  };

  const colors = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-purple-500 to-pink-600',
    'from-orange-500 to-red-600',
    'from-cyan-500 to-blue-600',
    'from-amber-500 to-yellow-600',
    'from-rose-500 to-pink-600',
    'from-violet-500 to-purple-600',
  ];

  // === COURSES LIST VIEW ===
  if (view === 'courses') {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Управление курсами</h1>
            <p className="text-slate-500">Создавайте курсы, модули, уроки и добавляйте материалы</p>
          </div>
          <button
            onClick={() => setShowCourseForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition shadow-lg shadow-blue-500/25"
          >
            <Plus className="w-4 h-4" />
            Новый курс
          </button>
        </div>

        {/* Create Course Modal */}
        {showCourseForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCourseForm(false)}>
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Создать новый курс</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Название курса *</label>
                  <input
                    type="text"
                    value={courseForm.title}
                    onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                    placeholder="Например: Робототехника (mBlock)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Описание</label>
                  <textarea
                    value={courseForm.description}
                    onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                    placeholder="Краткое описание курса..."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Цвет карточки</label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setCourseForm({ ...courseForm, color })}
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} ${
                          courseForm.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCourseForm(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
                >
                  Отмена
                </button>
                <button
                  onClick={handleCreateCourse}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition"
                >
                  Создать
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Courses list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition">
              <div className={`h-20 bg-gradient-to-br ${course.color} relative`}>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg leading-tight drop-shadow-sm">{course.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-slate-600 line-clamp-2 mb-3">{course.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    {modules.filter(m => m.courseId === course.id).length} модулей • {lessons.filter(l => modules.filter(m => m.courseId === course.id).some(m => m.id === l.moduleId)).length} уроков
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedCourseId(course.id); setView('course-detail'); }}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 transition"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => { if (confirm('Удалить курс?')) deleteCourse(course.id); }}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // === COURSE DETAIL VIEW (modules & lessons) ===
  if (view === 'course-detail' && selectedCourse) {
    return (
      <div>
        <button
          onClick={() => setView('courses')}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к курсам
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{selectedCourse.title}</h1>
            <p className="text-slate-500 text-sm">{selectedCourse.description}</p>
          </div>
          <button
            onClick={() => setShowModuleForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
          >
            <FolderPlus className="w-4 h-4" />
            Добавить модуль
          </button>
        </div>

        {/* Create Module Modal */}
        {showModuleForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModuleForm(false)}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Добавить модуль</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Название модуля *</label>
                  <input
                    type="text"
                    value={moduleForm.title}
                    onChange={e => setModuleForm({ title: e.target.value })}
                    placeholder="Например: 1 год обучения — Основы"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModuleForm(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition">
                  Отмена
                </button>
                <button onClick={handleCreateModule} className="flex-1 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition">
                  Создать
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modules list */}
        <div className="space-y-4">
          {courseModules.map(module => {
            const moduleLessons = lessons.filter(l => l.moduleId === module.id).sort((a, b) => a.orderIndex - b.orderIndex);
            const isExpanded = expandedModule === module.id;

            return (
              <div key={module.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-4 flex items-center gap-3 border-b border-slate-100">
                  <button
                    onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                    className="p-1 hover:bg-slate-100 rounded transition"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-600" /> : <ChevronRight className="w-4 h-4 text-slate-600" />}
                  </button>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{module.title}</h3>
                    <p className="text-xs text-slate-500">{moduleLessons.length} уроков</p>
                  </div>
                  <button
                    onClick={() => { if (confirm('Удалить модуль и все его уроки?')) deleteModule(module.id); }}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {isExpanded && (
                  <div className="p-4 bg-slate-50/50">
                    {/* Lessons list */}
                    {moduleLessons.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {moduleLessons.map(lesson => (
                          <div key={lesson.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100">
                            <GripVertical className="w-4 h-4 text-slate-300" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-900">{lesson.title}</p>
                              <p className="text-xs text-slate-500">{lesson.materials.length} материалов</p>
                            </div>
                            <button
                              onClick={() => { setSelectedLessonId(lesson.id); setView('lesson-editor'); }}
                              className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              Редактировать
                            </button>
                            <button
                              onClick={() => { if (confirm('Удалить урок?')) deleteLesson(lesson.id); }}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add lesson button */}
                    <button
                      onClick={() => { setExpandedModule(module.id); setShowLessonForm(true); }}
                      className="w-full p-3 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition flex items-center justify-center gap-2"
                    >
                      <FilePlus className="w-4 h-4" />
                      Добавить урок
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add module button */}
          <button
            onClick={() => setShowModuleForm(true)}
            className="w-full p-4 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition flex items-center justify-center gap-2"
          >
            <FolderPlus className="w-5 h-5" />
            Добавить модуль (год обучения)
          </button>
        </div>

        {/* Create Lesson Modal */}
        {showLessonForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowLessonForm(false)}>
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Добавить урок</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Название урока *</label>
                  <input
                    type="text"
                    value={lessonForm.title}
                    onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                    placeholder="Например: Знакомство с mBlock"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Содержание урока (HTML)</label>
                  <textarea
                    value={lessonForm.content}
                    onChange={e => setLessonForm({ ...lessonForm, content: e.target.value })}
                    placeholder="<h2>Заголовок</h2><p>Текст урока...</p>"
                    rows={6}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none font-mono text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-1">Поддерживается HTML: h2, h3, p, ul, li, pre, code, strong</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowLessonForm(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition">
                  Отмена
                </button>
                <button onClick={handleCreateLesson} className="flex-1 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition">
                  Создать
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // === LESSON EDITOR VIEW ===
  if (view === 'lesson-editor' && selectedLesson) {
    return (
      <div>
        <button
          onClick={() => { setView('course-detail'); setSelectedLessonId(null); }}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к модулям
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">{selectedLesson.title}</h1>
          <p className="text-slate-500 text-sm">Редактирование урока и материалов</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lesson content editor */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Содержание урока
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Название</label>
                <input
                  type="text"
                  value={selectedLesson.title}
                  onChange={e => updateLesson(selectedLesson.id, { title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">HTML-содержание</label>
                <textarea
                  value={selectedLesson.content}
                  onChange={e => updateLesson(selectedLesson.id, { content: e.target.value })}
                  rows={12}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none font-mono text-sm"
                />
              </div>
              <button
                onClick={() => { alert('Изменения сохранены!'); }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition"
              >
                <Save className="w-4 h-4" />
                Сохранить
              </button>
            </div>
          </div>

          {/* Materials */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Материалы урока
              </h3>
              <button
                onClick={() => setShowMaterialForm(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 transition"
              >
                <Plus className="w-3 h-3" />
                Добавить
              </button>
            </div>

            {selectedLesson.materials.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <FileText className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Материалы не добавлены</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedLesson.materials.map(mat => (
                  <div key={mat.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    {mat.type === 'pdf' && <FileText className="w-5 h-5 text-red-500" />}
                    {mat.type === 'video' && <Play className="w-5 h-5 text-blue-500" />}
                    {mat.type === 'link' && <Link2 className="w-5 h-5 text-emerald-500" />}
                    {mat.type === 'text' && <FileText className="w-5 h-5 text-slate-500" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{mat.title}</p>
                      <p className="text-xs text-slate-500">{mat.type === 'pdf' ? 'PDF документ' : mat.type === 'video' ? 'Видео' : mat.type === 'link' ? 'Ссылка' : 'Текст'}</p>
                    </div>
                    <button
                      onClick={() => deleteMaterial(mat.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Material Modal */}
        {showMaterialForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowMaterialForm(false)}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Добавить материал</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Тип материала</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['text', 'pdf', 'video', 'link'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setMaterialForm({ ...materialForm, type })}
                        className={`p-3 rounded-lg border-2 text-center transition ${
                          materialForm.type === type
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {type === 'text' && <FileText className="w-5 h-5 mx-auto mb-1 text-slate-500" />}
                        {type === 'pdf' && <FileText className="w-5 h-5 mx-auto mb-1 text-red-500" />}
                        {type === 'video' && <Play className="w-5 h-5 mx-auto mb-1 text-blue-500" />}
                        {type === 'link' && <Link2 className="w-5 h-5 mx-auto mb-1 text-emerald-500" />}
                        <span className="text-xs font-medium text-slate-700">
                          {type === 'text' ? 'Текст' : type === 'pdf' ? 'PDF' : type === 'video' ? 'Видео' : 'Ссылка'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Название *</label>
                  <input
                    type="text"
                    value={materialForm.title}
                    onChange={e => setMaterialForm({ ...materialForm, title: e.target.value })}
                    placeholder="Например: Инструкция по установке"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {materialForm.type === 'link' ? 'URL' : 'Содержание / Описание'}
                  </label>
                  {materialForm.type === 'pdf' || materialForm.type === 'video' ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-blue-300 transition cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">Нажмите для загрузки файла</p>
                      <p className="text-xs text-slate-400 mt-1">или перетащите файл сюда</p>
                      <input
                        type="text"
                        value={materialForm.content}
                        onChange={e => setMaterialForm({ ...materialForm, content: e.target.value })}
                        placeholder="Или вставьте URL файла..."
                        className="w-full mt-3 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                  ) : (
                    <textarea
                      value={materialForm.content}
                      onChange={e => setMaterialForm({ ...materialForm, content: e.target.value })}
                      placeholder={materialForm.type === 'link' ? 'https://...' : 'Текст материала...'}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowMaterialForm(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition">
                  Отмена
                </button>
                <button onClick={handleCreateMaterial} className="flex-1 py-2.5 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition">
                  Добавить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
