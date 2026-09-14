import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { 
  Shield, Users, FileText, Clock, CheckCircle, XCircle, AlertCircle,
  Eye, ChevronDown, Search, Filter, Activity
} from 'lucide-react';

type TabType = 'requests' | 'access' | 'audit';

export default function AdminPage() {
  const { accessRequests, approveRequest, rejectRequest, auditLog, currentUser, courses, userCourseAccess } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

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

  const pendingRequests = accessRequests.filter(r => r.status === 'PENDING');
  const filteredRequests = accessRequests.filter(r => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.userName.toLowerCase().includes(q) || r.courseTitle.toLowerCase().includes(q);
    }
    return true;
  });

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
    { id: 'requests' as TabType, label: 'Заявки на доступ', icon: AlertCircle, count: pendingRequests.length },
    { id: 'access' as TabType, label: 'Права доступа', icon: Users },
    { id: 'audit' as TabType, label: 'Журнал аудита', icon: Activity },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Панель управления</h1>
        <p className="text-slate-500">Управление доступами, заявками и аудит действий пользователей</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{pendingRequests.length}</p>
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
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{courses.length}</p>
              <p className="text-xs text-slate-500">Курсов в системе</p>
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
                onClick={() => { setActiveTab(tab.id); setSearchQuery(''); setStatusFilter('ALL'); }}
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

          {activeTab === 'access' && (
            <>
              {userCourseAccess.map((access, idx) => {
                const course = courses.find(c => c.id === access.courseId);
                return (
                  <div key={idx} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">
                        Пользователь: {access.userId}
                      </p>
                      <p className="text-xs text-slate-500">
                        Курс: <span className="font-medium">{course?.title || access.courseId}</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Выдан: {access.grantedAt || '—'}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded">
                      Активен
                    </span>
                  </div>
                );
              })}
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
