import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { 
  Shield, Users, FileText, Clock, CheckCircle, XCircle, AlertCircle,
  Eye, ChevronDown, ChevronRight, Search, Filter, Activity, UserCheck, 
  UserX, BookOpen, Trash2
} from 'lucide-react';

type TabType = 'requests' | 'users' | 'access' | 'audit';

export default function AdminPage() {
  const { accessRequests, approveRequest, rejectRequest, auditLog, currentUser, courses, userCourseAccess, modules, users, approveUser, rejectUser, revokeAccess, grantAccess } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  if (!currentUser || (currentUser.role !== 'superadmin' && currentUser.role !== 'methodist')) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Доступ запрещён</h2>
        <p className="text-slate-500">Эта страница доступна только администраторам и методистам.</p>
      </div>
    );
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchQuery('');
    setStatusFilter('ALL');
    setExpandedUser(null);
    setSelectedTeacher(null);
  };

  const pendingRequests = accessRequests.filter(r => r.status === 'PENDING');
  const pendingUsers = users.filter(u => u.status === 'pending');
  
  const filteredRequests = accessRequests.filter(r => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.userName.toLowerCase().includes(q) || r.courseTitle.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredUsers = users.filter(u => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  // Только преподаватели для вкладки "Права доступа"
  const teachers = users.filter(u => u.role === 'teacher' && u.status === 'active');
  const filteredTeachers = teachers.filter(t => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.fullName.toLowerCase().includes(q) || t.email.toLowerCase().includes(q);
    }
    return true;
  });

  const selectedTeacherData = users.find(u => u.id === selectedTeacher);
  const teacherAccesses = selectedTeacher ? userCourseAccess.filter(a => a.userId === selectedTeacher) : [];
  const teacherCourseIds = teacherAccesses.map(a => a.courseId);
  const availableCourses = courses.filter(c => !teacherCourseIds.includes(c.id));

  const filteredAudit = auditLog.filter(entry => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return entry.userName.toLowerCase().includes(q) || 
             entry.action.toLowerCase().includes(q) ||
             entry.resourceType.toLowerCase().includes(q);
    }
    return true;
  });

  const tabs = [
    { id: 'users' as TabType, label: 'Пользователи', icon: Users, count: pendingUsers.length },
    { id: 'access' as TabType, label: 'Права доступа', icon: Shield },
    { id: 'requests' as TabType, label: 'Заявки на доступ', icon: AlertCircle, count: pendingRequests.length },
    { id: 'audit' as TabType, label: 'Журнал аудита', icon: Activity },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Панель управления</h1>
        <p className="text-slate-500">Управление пользователями, заявками и аудит действий</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{users.filter(u => u.status === 'active').length}</p>
              <p className="text-xs text-slate-500">Активных пользователей</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{pendingUsers.length}</p>
              <p className="text-xs text-slate-500">Ожидают одобрения</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{userCourseAccess.length}</p>
              <p className="text-xs text-slate-500">Активных доступов</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{auditLog.length}</p>
              <p className="text-xs text-slate-500">Записей в аудите</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <div className="flex items-center gap-1 px-4 pt-3">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Filter */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Поиск..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>
          {activeTab === 'requests' && (
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="ALL">Все статусы</option>
                <option value="PENDING">Ожидают</option>
                <option value="APPROVED">Одобрены</option>
                <option value="REJECTED">Отклонены</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Tab content */}
        <div className="divide-y divide-slate-100">
          {activeTab === 'users' && (
            <>
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>Нет пользователей</p>
                </div>
              ) : (
                filteredUsers.map(user => (
                  <div key={user.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      user.status === 'active' ? 'bg-emerald-50' :
                      user.status === 'pending' ? 'bg-amber-50' : 'bg-red-50'
                    }`}>
                      {user.status === 'active' && <UserCheck className="w-5 h-5 text-emerald-600" />}
                      {user.status === 'pending' && <Clock className="w-5 h-5 text-amber-600" />}
                      {user.status === 'rejected' && <UserX className="w-5 h-5 text-red-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{user.fullName}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Роль: <span className="font-medium">
                          {user.role === 'superadmin' ? 'Администратор' : 
                           user.role === 'methodist' ? 'Методист' : 'Преподаватель'}
                        </span>
                        {' • '}
                        Регистрация: {new Date(user.registeredAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {user.status === 'pending' && (
                        <>
                          <button
                            onClick={() => approveUser(user.id)}
                            className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 transition"
                          >
                            Одобрить
                          </button>
                          <button
                            onClick={() => rejectUser(user.id)}
                            className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-100 transition"
                          >
                            Отклонить
                          </button>
                        </>
                      )}
                      {user.status === 'active' && (
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded">
                          Активен
                        </span>
                      )}
                      {user.status === 'rejected' && (
                        <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded">
                          Отклонён
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'access' && (
            <>
              {filteredTeachers.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>Нет активных преподавателей</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-6">
                  {/* Список преподавателей */}
                  <div className="lg:col-span-1 border-r border-slate-100">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                      <h3 className="text-sm font-semibold text-slate-700">Преподаватели ({filteredTeachers.length})</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {filteredTeachers.map(teacher => {
                        const accessCount = userCourseAccess.filter(a => a.userId === teacher.id).length;
                        const isSelected = selectedTeacher === teacher.id;
                        return (
                          <button
                            key={teacher.id}
                            onClick={() => setSelectedTeacher(teacher.id)}
                            className={`w-full p-4 text-left transition ${
                              isSelected ? 'bg-blue-50 border-l-2 border-blue-500' : 'hover:bg-slate-50'
                            }`}
                          >
                            <p className="text-sm font-medium text-slate-900">{teacher.fullName}</p>
                            <p className="text-xs text-slate-500 truncate">{teacher.email}</p>
                            <p className="text-xs text-blue-600 mt-1 font-medium">
                              {accessCount} {accessCount === 1 ? 'курс' : accessCount < 5 ? 'курса' : 'курсов'}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Детали преподавателя */}
                  <div className="lg:col-span-2 p-4">
                    {selectedTeacherData ? (
                      <div>
                        {/* Заголовок */}
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">{selectedTeacherData.fullName}</h3>
                            <p className="text-sm text-slate-500">{selectedTeacherData.email}</p>
                          </div>
                        </div>

                        {/* Есть доступ */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Доступные курсы ({teacherAccesses.length})
                          </h4>
                          {teacherAccesses.length === 0 ? (
                            <p className="text-sm text-slate-400 italic">Нет доступов</p>
                          ) : (
                            <div className="space-y-2">
                              {teacherAccesses.map((access, idx) => {
                                const course = courses.find(c => c.id === access.courseId);
                                return (
                                  <div key={idx} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                                      <BookOpen className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-slate-900">{course?.title || 'Курс удалён'}</p>
                                      <p className="text-xs text-slate-500">
                                        Выдан: {new Date(access.grantedAt).toLocaleDateString('ru-RU')}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        if (confirm(`Отозвать доступ к курсу "${course?.title}"?`)) {
                                          revokeAccess(selectedTeacher!, access.courseId);
                                        }
                                      }}
                                      className="flex items-center gap-1 px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 transition"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      Отозвать
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Нет доступа */}
                        <div>
                          <h4 className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            Недоступные курсы ({availableCourses.length})
                          </h4>
                          {availableCourses.length === 0 ? (
                            <p className="text-sm text-slate-400 italic">Все курсы доступны</p>
                          ) : (
                            <div className="space-y-2">
                              {availableCourses.map(course => (
                                <div key={course.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 opacity-75">
                                  <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                                    <BookOpen className="w-4 h-4 text-slate-500" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-700">{course.title}</p>
                                    <p className="text-xs text-slate-500">{course.description.slice(0, 60)}...</p>
                                  </div>
                                  <button
                                    onClick={() => grantAccess(selectedTeacher!, course.id)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition"
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                    Выдать
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                          <Users className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-medium">Выберите преподавателя</p>
                        <p className="text-sm text-slate-400 mt-1">Нажмите на преподавателя слева для просмотра и управления его доступами</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'requests' && (
            <>
              {filteredRequests.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>Нет заявок</p>
                </div>
              ) : (
                filteredRequests.map(request => (
                  <div key={request.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      request.status === 'PENDING' ? 'bg-amber-50' :
                      request.status === 'APPROVED' ? 'bg-emerald-50' : 'bg-red-50'
                    }`}>
                      {request.status === 'PENDING' && <Clock className="w-5 h-5 text-amber-600" />}
                      {request.status === 'APPROVED' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                      {request.status === 'REJECTED' && <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{request.userName}</p>
                      <p className="text-xs text-slate-500 truncate">
                        Запрос: <span className="font-medium">{request.courseTitle}</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(request.createdAt).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {request.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => approveRequest(request.id)}
                            className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 transition"
                          >
                            Выдать доступ
                          </button>
                          <button
                            onClick={() => rejectRequest(request.id)}
                            className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-100 transition"
                          >
                            Отклонить
                          </button>
                        </>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          request.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {request.status === 'APPROVED' ? 'Одобрено' : 'Отклонено'}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'audit' && (
            <>
              {filteredAudit.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>Нет записей</p>
                </div>
              ) : (
                filteredAudit.map(entry => (
                  <div key={entry.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                      <Eye className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{entry.userName}</p>
                      <p className="text-xs text-slate-500">
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{entry.action}</span>
                        {' '}→ {entry.resourceType}:{entry.resourceId}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        IP: {entry.ip} • {new Date(entry.createdAt).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
