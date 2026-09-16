# 🚀 Инструкция по запуску LMS Азимов

Полное руководство по запуску всей системы: frontend + backend + инфраструктура.

## 📋 Требования

### Обязательные
- **Docker** и **Docker Compose** (для PostgreSQL, Redis, MinIO)
- **Java 21** (для backend)
- **Maven 3.8+** (для сборки backend)
- **Node.js 18+** и **npm** (для frontend)

### Проверка установки

```bash
# Docker
docker --version
docker-compose --version

# Java
java -version  # Должна быть 21

# Maven
mvn -version

# Node.js
node -version  # Должна быть 18+
npm -version
```

## 🎯 Быстрый старт (всё в одном)

### Шаг 1: Клонировать репозиторий

```bash
git clone <repository-url>
cd school-lms
```

### Шаг 2: Запустить backend

```bash
cd backend

# Сделать скрипт исполняемым
chmod +x start.sh

# Запустить всё одной командой
./start.sh
```

**Что произойдёт:**
1. ✅ Поднимется PostgreSQL, Redis, MinIO
2. ✅ Соберётся backend
3. ✅ Запустится backend на порту 8080

### Шаг 3: Запустить frontend (в новом терминале)

```bash
cd frontend
npm install
npm run dev
```

### Шаг 4: Открыть приложение

Откройте браузер: **http://localhost:5173**

Войдите как:
- **Админ:** admin@azimovclub.com (пароль любой)
- **Методист:** methodist@azimovclub.com (пароль любой)
- **Преподаватель:** teacher1@azimovclub.com (пароль любой)

## 🔧 Пошаговый запуск (вручную)

Если скрипт не работает, запустите всё вручную:

### 1. Поднять инфраструктуру

```bash
cd backend
docker-compose up -d

# Проверить статус
docker-compose ps
```

Должны быть запущены:
- ✅ azimov-postgres (5432)
- ✅ azimov-redis (6379)
- ✅ azimov-minio (9000, 9001)

### 2. Собрать backend

```bash
cd backend
mvn clean package -DskipTests
```

### 3. Запустить backend

```bash
java -jar target/azimov-lms-0.1.0.jar
```

Или через Maven:
```bash
mvn spring-boot:run
```

### 4. Запустить frontend

```bash
cd frontend
npm install
npm run dev
```

## 🧪 Проверка работы

### Backend API

```bash
# Health check
curl http://localhost:8080/api/actuator/health

# Получить каталог курсов
curl http://localhost:8080/api/catalog/courses?userId=u3

# Получить конкретный курс
curl http://localhost:8080/api/catalog/courses/c1?userId=u3
```

**Ожидаемый ответ:**
```json
[
  {
    "id": "c1",
    "title": "Робототехника (mBlock)",
    "description": "Программирование роботов в среде mBlock...",
    "authorId": "u2",
    "authorName": "Петрова Мария",
    "status": "ACTIVE",
    "moduleCount": 3,
    "lessonCount": 36,
    "color": "from-cyan-500 to-blue-600",
    "hasAccess": true
  }
]
```

### Frontend

Откройте **http://localhost:5173** и войдите как `teacher1@azimovclub.com`.

Должны увидеть:
- ✅ Каталог курсов
- ✅ Доступные курсы (Робототехника, Пайка, Minecraft)
- ✅ Закрытые курсы (Python, Unity, Олимпиадные)

### База данных

```bash
docker exec -it azimov-postgres psql -U azimov -d azimov_lms

# Выполнить запросы
SELECT * FROM courses;
SELECT * FROM users;
SELECT * FROM user_course_access WHERE user_id = 'u3';
```

### MinIO

Откройте **http://localhost:9001**

Учётные данные:
- Логин: `minioadmin`
- Пароль: `minioadmin`

Должны увидеть bucket `azimov-lms`.

## 🔄 Интеграция frontend с backend

После запуска backend, интегрируйте frontend с реальным API.

### Шаг 1: Создать API клиент

Создайте файл `frontend/src/api/client.ts`:

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
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },
};
```

### Шаг 2: Обновить AppContext

В `frontend/src/store/AppContext.tsx` замените моки на API вызовы:

```typescript
import { apiClient } from '../api/client';

// Было:
// const [courses, setCourses] = useState<Course[]>(mockCourses);

// Стало:
const [courses, setCourses] = useState<Course[]>([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const userId = currentUser?.id || 'u3';
      const data = await apiClient.get<Course[]>('/catalog/courses', { userId });
      setCourses(data);
    } catch (err) {
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

Подробная инструкция: [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)

## 🛑 Остановка

### Остановить backend

В терминале где запущен backend нажмите `Ctrl+C`.

### Остановить инфраструктуру

```bash
cd backend
./stop.sh

# Или вручную
docker-compose down
```

### Полная очистка (удалит все данные!)

```bash
cd backend
docker-compose down -v
```

## 🐛 Решение проблем

### Проблема: Порт 8080 занят

**Решение:** Найдите и остановите процесс:

```bash
# Linux/Mac
lsof -ti:8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Проблема: Docker не запускается

**Решение:** Проверьте, что Docker запущен:

```bash
# Linux
sudo systemctl start docker

# Mac/Windows
# Откройте Docker Desktop
```

### Проблема: PostgreSQL не подключается

**Решение:** Проверьте статус контейнера:

```bash
docker-compose ps postgres
docker-compose logs postgres
```

### Проблема: Backend не видит базу данных

**Решение:** Убедитесь, что PostgreSQL запущен:

```bash
docker exec -it azimov-postgres psql -U azimov -d azimov_lms -c "SELECT 1;"
```

### Проблема: CORS ошибки в браузере

**Решение:** Проверьте `CorsConfig.java` на backend. Убедитесь, что разрешён `http://localhost:5173`.

### Проблема: Frontend не загружает курсы

**Решение:**
1. Проверьте, что backend запущен: `curl http://localhost:8080/api/actuator/health`
2. Откройте консоль браузера (F12) и проверьте ошибки
3. Проверьте Network tab - должен быть запрос к `/api/catalog/courses`

## 📊 Мониторинг

### Логи backend

```bash
# Если запущен через Java
tail -f logs/application.log

# Если запущен через Docker
docker-compose logs -f backend
```

### Логи PostgreSQL

```bash
docker-compose logs -f postgres
```

### Логи MinIO

```bash
docker-compose logs -f minio
```

## 📚 Дополнительные команды

### Перезапустить backend

```bash
cd backend
mvn spring-boot:run
```

### Пересобрать backend

```bash
cd backend
mvn clean package -DskipTests
```

### Обновить зависимости

```bash
cd backend
mvn versions:display-dependency-updates
```

### Запустить тесты

```bash
cd backend
mvn test
```

## 🎓 Следующие шаги

После успешного запуска:

1. **Интегрируйте frontend с backend**
   - Замените моки на API вызовы
   - Добавьте обработку ошибок
   - Добавьте кэширование

2. **Добавьте новые endpoints**
   - Модули и уроки
   - Управление доступами
   - Загрузка файлов

3. **Настройте аутентификацию**
   - JWT токены
   - Spring Security
   - Refresh tokens

4. **Добавьте кэширование**
   - Redis для каталога курсов
   - Кэширование сессий

5. **Настройте CI/CD**
   - GitHub Actions
   - Автоматический деплой
   - Тесты

## 📞 Поддержка

Если возникли проблемы:

1. Проверьте логи: `docker-compose logs`
2. Проверьте статус: `docker-compose ps`
3. Перезапустите: `docker-compose restart`
4. Обратитесь к документации:
   - [Backend README](backend/README.md)
   - [Integration Guide](INTEGRATION_GUIDE.md)

## ✅ Чек-лист запуска

- [ ] Docker установлен и запущен
- [ ] Java 21 установлена
- [ ] Maven установлен
- [ ] Node.js 18+ установлен
- [ ] Инфраструктура запущена (docker-compose up -d)
- [ ] Backend собран (mvn clean package)
- [ ] Backend запущен (java -jar target/azimov-lms-0.1.0.jar)
- [ ] Frontend запущен (npm run dev)
- [ ] Backend API доступен (curl http://localhost:8080/api/actuator/health)
- [ ] Frontend доступен (http://localhost:5173)
- [ ] Можно войти в систему
- [ ] Каталог курсов загружается

---

**Версия:** 1.0  
**Дата:** 15 сентября 2026  
**Статус:** ✅ Готово к запуску
