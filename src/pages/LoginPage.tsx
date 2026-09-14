import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Mail, AlertCircle } from 'lucide-react';
import AzimovLogo from '../components/AzimovLogo';

export default function LoginPage() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, password);
    if (!success) {
      setError('Неверный email или пароль');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <AzimovLogo size="lg" showText={false} dark />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Азимов</h1>
          <p className="text-blue-200/70">Школа робототехники и программирования</p>
          <p className="text-blue-200/50 text-sm mt-1">Внутренняя платформа обучения</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Вход в систему</h2>
          
          {error && (
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/50" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="teacher@azimovclub.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-1.5">Пароль</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition shadow-lg shadow-blue-500/25 active:scale-[0.98]"
            >
              Войти
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-sm text-blue-200/70 text-center mb-3">
              Нет аккаунта?{' '}
              <Link to="/register" className="text-blue-300 hover:text-white font-medium transition">
                Зарегистрироваться
              </Link>
            </p>
            <div className="pt-3 border-t border-white/10">
              <p className="text-xs text-blue-200/50 mb-2">Тестовые аккаунты:</p>
              <div className="space-y-1 text-xs text-blue-200/70">
                <p><span className="text-blue-300">Админ:</span> admin@azimovclub.com</p>
                <p><span className="text-blue-300">Методист:</span> methodist@azimovclub.com</p>
                <p><span className="text-blue-300">Преподаватель:</span> teacher1@azimovclub.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
