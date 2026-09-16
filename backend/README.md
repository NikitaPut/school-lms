# 🚀 Backend для LMS Азимов

Backend на Spring Boot 3 для закрытой системы обучения школы робототехники "Азимов".

## 📋 Технологический стек

- **Java 21** (LTS)
- **Spring Boot 3.2.5**
- **Spring Data JPA** (Hibernate)
- **PostgreSQL 16**
- **Redis 7** (кэширование)
- **MinIO** (S3-compatible хранилище)
- **Maven** (сборка)
- **Docker Compose** (инфраструктура)

## 📁 Структура проекта

```
backend/
├── src/main/java/com/azimov/lms/
│   ├── AzimovLmsApplication.java       # Главный класс
│   ├── config/
│   │   ├── CorsConfig.java             # CORS конфигурация
│   │   └── MinioConfig.java            # MinIO клиент
│   ├── controller/
│   │   └── CatalogController.java      # API каталога курсов
│   ├── dto/
│   │   └── CourseDto.java              # DTO для курсов
│   ├── model/
│   │   └── Course.java                 # Entity курса
│   ├── repository/
│   │   ├── CourseRepository.java       # Репозиторий курсов
│   │   ├── UserCourseAccess.java       # Entity доступа
│   │   └── UserCourseAccessRepository.java
│   └── service/
│       └── CourseService.java          # Бизнес-логика
├── src/main/resources/
│   └── application.yml                 # Конфигурация
├── docker-compose.yml                  # Инфраструктура
├── init.sql                            # Инициализация БД
└── pom.xml                             # Зависимости Maven
```

## 🚀 Быстрый старт

### 1. Поднять инфраструктуру (PostgreSQL, Redis, MinIO)

```bash
cd backend
docker-compose up -d
```

Проверьте статус:
```bash
docker-compose ps
```

Должны быть запущены:
- ✅ azimov-postgres (порт 5432)
- ✅ azimov-redis (порт 6379)
- ✅ azimov-minio (порты 9000, 9001)

### 2. Собрать и запустить backend

**Вариант A: Через Maven**
```bash
# Сборка
mvn clean package -DskipTests

# Запуск
java -jar target/azimov-lms-0.1.0.jar
```

**Вариант B: Через Maven Spring Boot plugin**
```bash
mvn spring-boot:run
```

**Вариант C: В IDE (IntelliJ IDEA)**
1. Откройте проект в IntelliJ IDEA
2. Дождитесь импорта Maven зависимостей
3. Запустите `AzimovLmsApplication.java`

### 3. Проверить работу

Backend запущен на **http://localhost:8080/api**

**Health check:**
```bash
curl http://localhost:8080/api/actuator/health
```

**Получить каталог курсов:**
```bash
curl http://localhost:8080/api/catalog/courses?userId=u3
```

**Получить конкретный курс:**
```bash
curl http://localhost:8080/api/catalog/courses/c1?userId=u3
```

### 4. Подключить фронтенд

Обновите `src/store/AppContext.tsx` во фронтенде для работы с реальным API:

```typescript
// Замените моки на API вызовы
const fetchCourses = async (userId: string) => {
  const response = await fetch(`http://localhost:8080/api/catalog/courses?userId=${userId}`);
  return response.json();
};
```

## 🔌 API Endpoints

### Каталог курсов

#### GET /api/catalog/courses
Получить список всех курсов для пользователя.

**Query параметры:**
- `userId` (string, optional) - ID пользователя (по умолчанию "u3")

**Ответ:**
```json
[
  {
    "id": "c1",
    "title": "Робототехника (mBlock)",
    "description": "Программирование роботов в среде mBlock...",
    "previewUrl": null,
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

#### GET /api/catalog/courses/{courseId}
Получить конкретный курс.

**Path параметры:**
- `courseId` (string) - ID курса

**Query параметры:**
- `userId` (string, optional) - ID пользователя

**Ответ:**
```json
{
  "id": "c1",
  "title": "Робототехника (mBlock)",
  "description": "...",
  "hasAccess": true
}
```

## 🗄️ База данных

### Подключение к PostgreSQL

```bash
docker exec -it azimov-postgres psql -U azimov -d azimov_lms
```

**Полезные запросы:**

```sql
-- Список всех курсов
SELECT * FROM courses;

-- Доступы пользователя
SELECT * FROM user_course_access WHERE user_id = 'u3';

-- Количество курсов по статусу
SELECT status, COUNT(*) FROM courses GROUP BY status;
```

### Схема базы данных

Основные таблицы:
- `users` - пользователи
- `courses` - курсы
- `modules` - модули (годы обучения)
- `lessons` - уроки
- `materials` - материалы уроков
- `user_course_access` - доступы к курсам
- `access_requests` - заявки на доступ
- `questions` - вопросы к урокам
- `answers` - ответы на вопросы
- `attachments` - вложения (фото/видео)
- `audit_log` - журнал аудита

### Тестовые данные

При первом запуске `init.sql` создаёт:
- 5 пользователей (админ, методист, 3 преподавателя)
- 8 курсов (5 основных + 3 олимпиадных)
- 7 записей о доступе

## 📦 MinIO (хранилище файлов)

**Консоль MinIO:** http://localhost:9001

**Учётные данные:**
- Логин: `minioadmin`
- Пароль: `minioadmin`

**Bucket:** `azimov-lms` (создаётся автоматически)

### Загрузка файлов через API

```bash
# Загрузить файл
curl -X PUT http://localhost:8080/api/files/upload \
  -F "file=@document.pdf" \
  -F "lessonId=l1"

# Получить presigned URL (60 секунд)
curl http://localhost:8080/api/files/presigned?fileId=abc123
```

## 🔧 Конфигурация

### application.yml

Основные настройки:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/azimov_lms
    username: azimov
    password: azimov_secret
  
  jpa:
    hibernate:
      ddl-auto: update  # auto-create tables
  
  minio:
    endpoint: http://localhost:9000
    access-key: minioadmin
    secret-key: minioadmin
    bucket-name: azimov-lms
```

### Переменные окружения

Для продакшена используйте переменные окружения:

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://prod-db:5432/azimov_lms
export SPRING_DATASOURCE_USERNAME=prod_user
export SPRING_DATASOURCE_PASSWORD=secure_password
export SPRING_MINIO_ENDPOINT=http://prod-minio:9000
```

## 🧪 Тестирование

### Запустить тесты

```bash
mvn test
```

### Интеграционные тесты

```bash
mvn verify
```

### Проверка API вручную

```bash
# Получить все курсы
curl -X GET "http://localhost:8080/api/catalog/courses?userId=u3" \
  -H "Accept: application/json"

# Получить конкретный курс
curl -X GET "http://localhost:8080/api/catalog/courses/c1?userId=u3" \
  -H "Accept: application/json"
```

## 🐛 Отладка

### Логи

Логи выводятся в консоль. Уровень логирования настраивается в `application.yml`:

```yaml
logging:
  level:
    com.azimov.lms: DEBUG
    org.springframework.web: INFO
```

### Проверка подключения к БД

```bash
# Проверить, что PostgreSQL запущен
docker-compose ps postgres

# Проверить подключение
docker exec -it azimov-postgres psql -U azimov -d azimov_lms -c "SELECT 1;"
```

### Проверка Redis

```bash
docker exec -it azimov-redis redis-cli ping
```

### Проверка MinIO

```bash
curl http://localhost:9000/minio/health/live
```

## 🔄 Следующие шаги

### Приоритетные задачи

1. **Аутентификация JWT**
   - Spring Security
   - JWT токены
   - Refresh tokens

2. **CRUD для модулей и уроков**
   - ModuleController
   - LessonController
   - MaterialController

3. **Управление доступами**
   - AccessRequestController
   - AdminController

4. **Загрузка файлов**
   - FileController
   - Presigned URLs
   - Валидация типов

5. **Вопросы и ответы**
   - QuestionController
   - AnswerController
   - AttachmentController

### Дополнительные задачи

6. **Кэширование Redis**
   - Кэш каталога курсов
   - Кэш сессий

7. **Аудит**
   - AuditController
   - Асинхронная запись логов

8. **Уведомления**
   - Telegram бот
   - Email уведомления

## 📚 Полезные ссылки

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Data JPA](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [MinIO Java SDK](https://min.io/docs/minio/linux/developers/java/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/16/)

## 🤝 Поддержка

Если возникли проблемы:

1. Проверьте логи: `docker-compose logs`
2. Проверьте статус сервисов: `docker-compose ps`
3. Перезапустите инфраструктуру: `docker-compose restart`
4. Очистите volumes: `docker-compose down -v` (удалит все данные!)

---

**Версия:** 0.1.0  
**Дата:** 15 сентября 2026  
**Статус:** MVP готов к разработке
