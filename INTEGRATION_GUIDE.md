# 🔗 Интеграция фронтенда с бэкендом

Руководство по замене моков на реальные API вызовы.

## 📋 Текущая архитектура

**Фронтенд (React + TypeScript):**
- Порт: 5173 (Vite dev server)
- Данные: моки в `src/data/mockData.ts`
- Состояние: React Context в `src/store/AppContext.tsx`

**Бэкенд (Spring Boot):**
- Порт: 8080
- API: `/api/catalog/courses`
- База данных: PostgreSQL 16

## 🔄 Пошаговая миграция

### Шаг 1: Создать API клиент

Создайте файл `src/api/client.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8080/api';

export const apiClient = {
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },
  
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },
};
```

### Шаг 2: Создать типы для API ответов

Создайте файл `src/api/types.ts`:

```typescript
export interface CourseDto {
  id: string;
  title: string;
  description: string;
  previewUrl: string | null;
  authorId: string;
  authorName: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  moduleCount: number;
  lessonCount: number;
  color: string;
  hasAccess: boolean;
}

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  role: 'superadmin' | 'methodist' | 'teacher';
  status: 'active' | 'pending' | 'rejected';
  registeredAt: string;
}
```

### Шаг 3: Обновить AppContext

Замените моки на API вызовы в `src/store/AppContext.tsx`:

```typescript
import { apiClient } from '../api/client';
import { CourseDto } from '../api/types';

// Было:
// const [courses, setCourses] = useState<Course[]>(mockCourses);

// Стало:
const [courses, setCourses] = useState<CourseDto[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// Загрузка курсов при монтировании
useEffect(() => {
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const userId = currentUser?.id || 'u3';
      const data = await apiClient.get<CourseDto[]>('/catalog/courses', { userId });
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки курсов');
      console.error('Ошибка загрузки курсов:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (currentUser) {
    fetchCourses();
  }
}, [currentUser]);
```

### Шаг 4: Обновить CatalogPage

Добавьте обработку загрузки и ошибок:

```typescript
const { courses, loading, error } = useApp();

if (loading) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
}

if (error) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="text-red-700">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-2 text-red-600 underline"
      >
        Попробовать снова
      </button>
    </div>
  );
}
```

### Шаг 5: Добавить кэширование (опционально)

Для улучшения производительности добавьте кэширование:

```typescript
const CACHE_KEY = 'courses_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

interface CacheEntry {
  data: CourseDto[];
  timestamp: number;
}

const getCachedCourses = (): CourseDto[] | null => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;
  
  const entry: CacheEntry = JSON.parse(cached);
  const now = Date.now();
  
  if (now - entry.timestamp > CACHE_DURATION) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
  
  return entry.data;
};

const setCachedCourses = (data: CourseDto[]) => {
  const entry: CacheEntry = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
};

// Использование:
const fetchCourses = async () => {
  // Проверяем кэш
  const cached = getCachedCourses();
  if (cached) {
    setCourses(cached);
    return;
  }
  
  // Загружаем с API
  const data = await apiClient.get<CourseDto[]>('/catalog/courses', { userId });
  setCourses(data);
  setCachedCourses(data);
};
```

## 🧪 Тестирование интеграции

### 1. Проверьте CORS

Откройте консоль браузера (F12) и проверьте, что нет ошибок CORS.

Если есть ошибки, проверьте `CorsConfig.java` на бэкенде.

### 2. Проверьте API ответы

```bash
# В терминале
curl http://localhost:8080/api/catalog/courses?userId=u3
```

Должен вернуть JSON с массивом курсов.

### 3. Проверьте в браузере

Откройте Network tab в DevTools:
- Запрос: `GET /api/catalog/courses?userId=u3`
- Status: 200 OK
- Response: JSON с курсами

### 4. Проверьте hasAccess

Для пользователя `u3` должны быть доступны курсы:
- c1 (Робототехника) ✅
- c2 (Пайка) ✅
- c4 (Minecraft) ✅

Остальные курсы должны иметь `hasAccess: false`.

## 🔄 Полный пример интеграции

### src/api/client.ts

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = {
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new ApiError(response.status, `API Error: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new ApiError(response.status, `API Error: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new ApiError(response.status, `API Error: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new ApiError(response.status, `API Error: ${response.statusText}`);
    }
    
    return response.json();
  },
};
```

### src/api/courses.ts

```typescript
import { apiClient } from './client';
import { CourseDto } from './types';

export const coursesApi = {
  getAll: (userId: string) => 
    apiClient.get<CourseDto[]>('/catalog/courses', { userId }),
  
  getById: (courseId: string, userId: string) => 
    apiClient.get<CourseDto>(`/catalog/courses/${courseId}`, { userId }),
};
```

### src/store/AppContext.tsx (фрагмент)

```typescript
import { coursesApi } from '../api/courses';

// В AppProvider:
const [courses, setCourses] = useState<CourseDto[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const fetchCourses = useCallback(async () => {
  if (!currentUser) return;
  
  try {
    setLoading(true);
    setError(null);
    const data = await coursesApi.getAll(currentUser.id);
    setCourses(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ошибка загрузки';
    setError(message);
  } finally {
    setLoading(false);
  }
}, [currentUser]);

useEffect(() => {
  fetchCourses();
}, [fetchCourses]);

// В контексте:
return (
  <AppContext.Provider value={{
    courses,
    loading,
    error,
    refetchCourses: fetchCourses,
    // ... остальные поля
  }}>
    {children}
  </AppContext.Provider>
);
```

## 🎯 Следующие endpoints для интеграции

После интеграции каталога курсов, добавьте:

1. **Модули и уроки**
   ```typescript
   GET /api/classroom/courses/{courseId}/modules
   GET /api/classroom/courses/{courseId}/modules/{moduleId}/lessons
   ```

2. **Управление доступами**
   ```typescript
   POST /api/access/requests
   GET /api/admin/access-requests
   POST /api/admin/access-requests/{id}/approve
   ```

3. **Загрузка файлов**
   ```typescript
   POST /api/files/upload
   GET /api/files/presigned/{fileId}
   ```

4. **Вопросы и ответы**
   ```typescript
   GET /api/lessons/{lessonId}/questions
   POST /api/lessons/{lessonId}/questions
   POST /api/questions/{questionId}/answers
   ```

## 🐛 Отладка

### Проблема: CORS ошибки

**Решение:** Проверьте `CorsConfig.java` на бэкенде. Убедитесь, что разрешён `http://localhost:5173`.

### Проблема: 404 Not Found

**Решение:** Проверьте, что backend запущен на порту 8080:
```bash
curl http://localhost:8080/api/actuator/health
```

### Проблема: Данные не загружаются

**Решение:** Проверьте логи backend:
```bash
docker-compose logs backend
```

### Проблема: hasAccess всегда false

**Решение:** Проверьте таблицу `user_course_access` в PostgreSQL:
```sql
SELECT * FROM user_course_access WHERE user_id = 'u3';
```

## 📚 Дополнительные ресурсы

- [React Query](https://tanstack.com/query/latest) - для управления API запросами
- [Axios](https://axios-http.com/) - альтернатива fetch
- [SWR](https://swr.vercel.app/) - легковесная библиотека для data fetching

---

**Версия:** 1.0  
**Дата:** 15 сентября 2026  
**Статус:** Готово к интеграции
