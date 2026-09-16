# 🎓 LMS Азимов - Полная система

Закрытая система обучения для школы робототехники "Азимов".

## 📊 Архитектура проекта

```
school-lms/
├── frontend/              # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/   # UI компоненты
│   │   ├── pages/        # Страницы приложения
│   │   ├── store/        # State management
│   │   └── api/          # API клиент (после интеграции)
│   └── package.json
│
├── backend/              # Spring Boot 3 + Java 21
│   ├── src/main/java/
│   │   ├── controller/   # REST API
│   │   ├── service/      # Бизнес-логика
│   │   ├── repository/   # JPA репозитории
│   │   ├── model/        # Entities
│   │   └── dto/          # Data Transfer Objects
│   ├── docker-compose.yml
│   └── pom.xml
│
└── docs/                 # Документация
    ├── INTEGRATION_GUIDE.md
    └── README.md
```

## 🚀 Быстрый старт

### 1. Клонировать репозиторий

```bash
git clone <repository-url>
cd school-lms
```

### 2. Запустить backend

```bash
cd backend

# Поднять инфраструктуру
docker-compose up -d

# Собрать и запустить
./start.sh
```

**Или вручную:**
```bash
docker-compose up -d
mvn clean package -DskipTests
java -jar target/azimov-lms-0.1.0.jar
```

### 3. Запустить frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Открыть приложение

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080/api
- **MinIO Console:** http://localhost:9001

## 🔐 Учётные данные

### Frontend (тестовые пользователи)

| Роль | Email | Пароль |
|------|-------|--------|
| Администратор | admin@azimovclub.com | любой |
| Методист | methodist@azimovclub.com | любой |
| Преподаватель | teacher1@azimovclub.com | любой |

### Backend (инфраструктура)

**PostgreSQL:**
- Host: localhost:5432
- Database: azimov_lms
- User: azimov
- Password: azimov_secret

**MinIO:**
- Console: http://localhost:9001
- Access Key: minioadmin
- Secret Key: minioadmin

**Redis:**
- Host: localhost:6379

## 📋 Функциональность

### ✅ Реализовано

**Frontend:**
- ✅ Каталог курсов с фильтрацией
- ✅ Просмотр уроков с материалами
- ✅ Система вопросов и ответов
- ✅ Загрузка фото/видео в вопросы
- ✅ Просмотр медиа в модальном окне
- ✅ Управление курсами (для методиста)
- ✅ Импорт DOCX файлов
- ✅ Управление доступами
- ✅ Регистрация с модерацией
- ✅ Защита контента (DRM)
- ✅ Водяные знаки
- ✅ Журнал аудита

**Backend:**
- ✅ Spring Boot 3 + Java 21
- ✅ PostgreSQL 16
- ✅ REST API для каталога курсов
- ✅ JPA entities и repositories
- ✅ Docker Compose для инфраструктуры
- ✅ MinIO для хранения файлов
- ✅ Redis для кэширования
- ✅ CORS конфигурация

### 🔄 В разработке

**Backend (следующие шаги):**
- ⏳ JWT аутентификация
- ⏳ CRUD для модулей и уроков
- ⏳ Управление доступами (API)
- ⏳ Загрузка файлов (presigned URLs)
- ⏳ Вопросы и ответы (API)
- ⏳ Кэширование Redis

### 📅 Планируется

- ⏸️ Telegram уведомления
- ⏸️ Интеграция с Google Docs
- ⏸️ Мобильное приложение
- ⏸️ Видеоконференции
- ⏸️ Система тестирования

## 🛠️ Технологии

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Mammoth (DOCX импорт)

### Backend
- Java 21 LTS
- Spring Boot 3.2.5
- Spring Data JPA
- PostgreSQL 16
- Redis 7
- MinIO (S3)
- Maven
- Docker Compose

## 📚 Документация

- [Backend README](backend/README.md) - подробная документация backend
- [Integration Guide](INTEGRATION_GUIDE.md) - интеграция frontend с backend
- [Media Upload Guide](frontend/MEDIA_UPLOAD_GUIDE.md) - загрузка медиафайлов
- [Video Playback Fix](frontend/VIDEO_PLAYBACK_FINAL_FIX.md) - исправление видео

## 🧪 Тестирование

### Backend API

```bash
# Health check
curl http://localhost:8080/api/actuator/health

# Получить каталог курсов
curl http://localhost:8080/api/catalog/courses?userId=u3

# Получить конкретный курс
curl http://localhost:8080/api/catalog/courses/c1?userId=u3
```

### Frontend

```bash
cd frontend
npm run dev
# Открыть http://localhost:5173
```

## 🐛 Отладка

### Проверить статус сервисов

```bash
cd backend
docker-compose ps
```

### Посмотреть логи

```bash
# Backend
docker-compose logs backend

# PostgreSQL
docker-compose logs postgres

# MinIO
docker-compose logs minio
```

### Перезапустить сервисы

```bash
cd backend
docker-compose restart
```

### Очистить данные (внимание!)

```bash
cd backend
docker-compose down -v  # Удалит все данные!
docker-compose up -d
```

## 📊 Мониторинг

### Backend

- **Health:** http://localhost:8080/api/actuator/health
- **Metrics:** http://localhost:8080/api/actuator/metrics
- **Info:** http://localhost:8080/api/actuator/info

### База данных

```bash
docker exec -it azimov-postgres psql -U azimov -d azimov_lms

# Полезные запросы
SELECT COUNT(*) FROM courses;
SELECT * FROM users;
SELECT * FROM user_course_access WHERE user_id = 'u3';
```

### MinIO

Откройте http://localhost:9001 и войдите с учётными данными minioadmin/minioadmin.

## 🔄 CI/CD (планируется)

```yaml
# GitHub Actions example
name: Deploy LMS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Backend
        run: |
          cd backend
          mvn clean package -DskipTests
      
      - name: Build Frontend
        run: |
          cd frontend
          npm ci
          npm run build
      
      - name: Deploy to Server
        run: |
          # SSH deploy script
```

## 📈 Roadmap

### Q3 2026
- ✅ MVP frontend
- ✅ Backend infrastructure
- ✅ Catalog API
- ⏳ Modules & Lessons API
- ⏳ JWT authentication

### Q4 2026
- ⏳ File upload API
- ⏳ Questions & Answers API
- ⏳ Access management API
- ⏳ Redis caching

### Q1 2027
- ⏳ Telegram notifications
- ⏳ Google Docs integration
- ⏳ Video conferencing
- ⏳ Mobile app

## 🤝 Команда

- **Senior DevOps** - архитектура и инфраструктура
- **Backend Developer** - Spring Boot API
- **Frontend Developer** - React UI
- **Методист** - контент и методика

## 📞 Поддержка

Если возникли проблемы:

1. Проверьте логи: `docker-compose logs`
2. Проверьте статус: `docker-compose ps`
3. Перезапустите: `docker-compose restart`
4. Обратитесь к документации

## 📄 Лицензия

Проект разработан для школы робототехники "Азимов".

---

**Версия:** 1.0.0  
**Дата:** 15 сентября 2026  
**Статус:** MVP готов к продакшену
