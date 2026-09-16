# 🔐 JWT Аутентификация - Краткое руководство

## ✅ Что сделано

### Backend полностью готов!

**Реализовано:**
1. ✅ Spring Security с JWT
2. ✅ BCrypt хеширование паролей
3. ✅ Access + Refresh токены
4. ✅ Защита endpoints по ролям
5. ✅ Регистрация и вход пользователей
6. ✅ Автоматическое обновление токенов

**Новые endpoints:**
```
POST /api/auth/register     - Регистрация нового пользователя
POST /api/auth/login        - Вход в систему
POST /api/auth/refresh      - Обновление access токена
GET  /api/auth/me           - Получение текущего пользователя
```

**Тестовые пользователи (пароль: password123):**
- admin@azimovclub.com (ADMIN)
- methodist@azimovclub.com (METHODIST)
- teacher1@azimovclub.com (TEACHER)
- teacher2@azimovclub.com (TEACHER)
- teacher3@azimovclub.com (TEACHER)

## 🧪 Как протестировать backend

### 1. Запустите backend

```bash
cd backend
./start.sh
```

### 2. Зарегистрируйте нового пользователя

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@azimovclub.com",
    "password": "password123",
    "fullName": "Тестовый Пользователь"
  }'
```

### 3. Войдите в систему

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher1@azimovclub.com",
    "password": "password123"
  }'
```

**Сохраните `accessToken` из ответа!**

### 4. Получите текущего пользователя

```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### 5. Доступ к защищенному endpoint

```bash
curl -X GET http://localhost:8080/api/catalog/courses \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## 📝 Что нужно сделать дальше

### 1. Обновить Frontend

Создайте файл `frontend/src/api/auth.ts`:

```typescript
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Неверный email или пароль');
    }
    
    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  },
  
  register: async (email: string, password: string, fullName: string) => {
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка регистрации');
    }
    
    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  },
  
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    const response = await fetch('http://localhost:8080/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    
    if (!response.ok) {
      throw new Error('Не удалось обновить токен');
    }
    
    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  }
};
```

### 2. Обновите API клиент

Создайте `frontend/src/api/client.ts`:

```typescript
import { authApi } from './auth';

const API_BASE_URL = 'http://localhost:8080/api';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('accessToken');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };
    
    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    // Если токен истек, пробуем обновить
    if (response.status === 401) {
      try {
        await authApi.refreshToken();
        const newToken = localStorage.getItem('accessToken');
        
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            ...headers,
            'Authorization': `Bearer ${newToken}`,
          },
        });
      } catch (error) {
        // Не удалось обновить токен, выходим
        authApi.logout();
        window.location.href = '/login';
        throw new Error('Сессия истекла');
      }
    }
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Ошибка запроса');
    }
    
    return response.json();
  }
  
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }
  
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
```

### 3. Обновите LoginPage.tsx

```typescript
import { authApi } from '../api/auth';

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  
  try {
    const response = await authApi.login(email, password);
    setUser(response.user);
    navigate('/catalog');
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Ошибка входа');
  }
};
```

### 4. Обновите RegisterPage.tsx

```typescript
import { authApi } from '../api/auth';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await authApi.register(
      formData.email,
      formData.password,
      formData.fullName
    );
    setSuccess(true);
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Ошибка регистрации');
  }
};
```

### 5. Обновите Layout.tsx

```typescript
import { authApi } from '../api/auth';

const handleLogout = () => {
  authApi.logout();
  navigate('/login');
};
```

### 6. Обновите AppContext.tsx

```typescript
import { authApi } from '../api/auth';

// При инициализации проверяем, есть ли токен
useEffect(() => {
  const user = authApi.getCurrentUser();
  if (user) {
    setCurrentUser(user);
  }
}, []);

const login = async (email: string, password: string) => {
  const response = await authApi.login(email, password);
  setCurrentUser(response.user);
  return response.user;
};

const logout = () => {
  authApi.logout();
  setCurrentUser(null);
};
```

### 7. Добавьте защиту роутов

Создайте `frontend/src/components/ProtectedRoute.tsx`:

```typescript
import { Navigate } from 'react-router-dom';
import { authApi } from '../api/auth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!authApi.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
```

Используйте в App.tsx:

```typescript
import { ProtectedRoute } from './components/ProtectedRoute';

<Route
  element={
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  }
>
  {/* ваши роуты */}
</Route>
```

## 🔒 Безопасность

### ⚠️ ВАЖНО перед продакшеном!

1. **Измените JWT secret** в `backend/src/main/resources/application.yml`:
   ```yaml
   jwt:
     secret: ${JWT_SECRET}  # Используйте переменную окружения!
   ```

2. **Сгенерируйте новый secret:**
   ```bash
   openssl rand -base64 32
   ```

3. **Настройте HTTPS** через Nginx или Traefik

4. **Обновите CORS** в SecurityConfig.java:
   ```java
   configuration.setAllowedOrigins(Arrays.asList(
       "https://your-domain.com"  // Ваш домен
   ));
   ```

## 📚 Документация

Полная документация: `backend/JWT_AUTHENTICATION.md`

## ✅ Чек-лист

- [x] Backend: JWT аутентификация реализована
- [x] Backend: BCrypt хеширование паролей
- [x] Backend: Access + Refresh токены
- [x] Backend: Защита endpoints
- [ ] Frontend: Обновить LoginPage
- [ ] Frontend: Обновить RegisterPage
- [ ] Frontend: Добавить API клиент с JWT
- [ ] Frontend: Добавить автоматическое обновление токена
- [ ] Frontend: Добавить защиту роутов
- [ ] Frontend: Добавить logout
- [ ] Production: Изменить JWT secret
- [ ] Production: Настроить HTTPS
- [ ] Production: Обновить CORS

---

**Статус:** Backend готов, нужно обновить frontend!
