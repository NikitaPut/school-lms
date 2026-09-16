# 🔐 JWT Аутентификация - Реализация

## ✅ Что реализовано

### Backend (Spring Boot)

#### 1. Зависимости
- **Spring Security** - безопасность приложения
- **JJWT 0.12.5** - генерация и валидация JWT токенов
- **BCrypt** - хеширование паролей

#### 2. Компоненты безопасности

**JwtUtil.java**
- Генерация access и refresh токенов
- Валидация токенов
- Извлечение данных из токенов (userId, email, role)
- Проверка истечения срока действия

**JwtAuthenticationFilter.java**
- Фильтр для проверки JWT в каждом запросе
- Извлечение токена из заголовка `Authorization: Bearer <token>`
- Установка аутентификации в SecurityContext

**SecurityConfig.java**
- Конфигурация Spring Security
- Stateless сессии (не используем cookies)
- Публичные endpoints: `/auth/**`, `/actuator/**`
- Защищенные endpoints по ролям:
  - `/admin/**` - только ADMIN
  - `/methodist/**` - ADMIN и METHODIST
  - Остальные - любая аутентифицированная роль
- CORS конфигурация
- BCrypt PasswordEncoder

#### 3. Модели и DTO

**User.java**
- Поле `passwordHash` для хранения хеша пароля
- Роли: ADMIN, METHODIST, TEACHER
- Статусы: ACTIVE, PENDING, REJECTED

**LoginRequest.java**
- Email и пароль для входа

**RegisterRequest.java**
- Email, пароль, fullName для регистрации

**AuthResponse.java**
- accessToken, refreshToken
- tokenType: "Bearer"
- expiresIn: время жизни токена
- user: информация о пользователе

**RefreshTokenRequest.java**
- Refresh token для обновления

#### 4. Сервисы

**AuthService.java**
- `register()` - регистрация нового пользователя
  - Проверка уникальности email
  - Хеширование пароля BCrypt
  - Создание пользователя со статусом PENDING
  - Генерация токенов
  
- `login()` - вход в систему
  - Проверка email и пароля
  - Проверка статуса пользователя
  - Генерация токенов
  
- `refreshToken()` - обновление access токена
  - Валидация refresh токена
  - Генерация новых токенов
  
- `getCurrentUser()` - получение текущего пользователя

#### 5. Контроллеры

**AuthController.java**
```
POST /api/auth/register     - Регистрация
POST /api/auth/login        - Вход
POST /api/auth/refresh      - Обновление токена
GET  /api/auth/me           - Текущий пользователь
```

### Конфигурация JWT

**application.yml**
```yaml
jwt:
  secret: azimov-lms-super-secret-key-for-jwt-tokens-must-be-at-least-256-bits-long-for-hs256
  access-token-expiration: 900000      # 15 минут
  refresh-token-expiration: 604800000  # 7 дней
```

⚠️ **ВАЖНО:** В продакшене используйте переменные окружения для secret!

### База данных

**init.sql**
- Добавлено поле `password_hash` в таблицу `users`
- Тестовые пользователи с хешем пароля "password123"

## 🧪 Тестирование API

### 1. Регистрация нового пользователя

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newteacher@azimovclub.com",
    "password": "password123",
    "fullName": "Новый Преподаватель"
  }'
```

**Ответ:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 900000,
  "user": {
    "id": "uuid-here",
    "email": "newteacher@azimovclub.com",
    "fullName": "Новый Преподаватель",
    "role": "TEACHER",
    "status": "PENDING",
    "registeredAt": "2026-09-15T12:00:00"
  }
}
```

### 2. Вход в систему

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher1@azimovclub.com",
    "password": "password123"
  }'
```

**Ответ:** аналогично регистрации

### 3. Получение текущего пользователя

```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Ответ:**
```json
{
  "id": "u3",
  "email": "teacher1@azimovclub.com",
  "fullName": "Сидорова Елена",
  "role": "TEACHER",
  "status": "ACTIVE",
  "registeredAt": "2026-03-10T09:15:00"
}
```

### 4. Обновление токена

```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

**Ответ:** новые access и refresh токены

### 5. Доступ к защищенному endpoint

```bash
curl -X GET http://localhost:8080/api/catalog/courses \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔒 Безопасность

### Хеширование паролей
- Используем **BCrypt** с автоматической солью
- Пароли никогда не хранятся в открытом виде
- Даже при утечке БД пароли защищены

### JWT токены
- **Access token** - короткоживущий (15 минут)
  - Используется для доступа к API
  - Содержит userId, email, role
  
- **Refresh token** - долгоживущий (7 дней)
  - Используется только для получения нового access token
  - Хранится в localStorage на фронтенде

### Защита endpoints
- `/auth/**` - публичные (login, register, refresh)
- `/admin/**` - только для ADMIN
- `/methodist/**` - для ADMIN и METHODIST
- Остальные - для любой аутентифицированной роли

### CORS
- Разрешены только доверенные домены:
  - `http://localhost:5173` (frontend dev)
  - `http://localhost:3000` (альтернативный порт)
  - `https://azimov-lms.vercel.app` (production)

## 📋 Следующие шаги

### 1. Обновить Frontend

Создать API клиент с поддержкой JWT:

```typescript
// frontend/src/api/auth.ts
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  },
  
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('http://localhost:8080/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};
```

### 2. Добавить interceptor для автоматического обновления токена

```typescript
// frontend/src/api/client.ts
const apiClient = {
  async get(url: string) {
    let token = localStorage.getItem('accessToken');
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 401) {
      // Токен истек, пробуем обновить
      await authApi.refreshToken();
      token = localStorage.getItem('accessToken');
      
      // Повторяем запрос
      return fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }
    
    return response;
  }
};
```

### 3. Обновить LoginPage.tsx

```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await authApi.login(email, password);
    setUser(response.user);
    navigate('/catalog');
  } catch (error) {
    setError('Неверный email или пароль');
  }
};
```

### 4. Добавить защиту роутов

```typescript
// frontend/src/components/ProtectedRoute.tsx
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return children;
};
```

### 5. Добавить logout в Layout

```typescript
const handleLogout = () => {
  authApi.logout();
  navigate('/login');
};
```

## 🚀 Deploy рекомендации

### 1. Измените JWT secret

**НИКОГДА** не используйте дефолтный secret в продакшене!

```bash
# Генерация секретного ключа
openssl rand -base64 32

# Или в Java
UUID.randomUUID().toString()
```

### 2. Используйте переменные окружения

```yaml
# application.yml
jwt:
  secret: ${JWT_SECRET}
  access-token-expiration: ${JWT_ACCESS_EXPIRATION:900000}
  refresh-token-expiration: ${JWT_REFRESH_EXPIRATION:604800000}
```

### 3. Настройте HTTPS

- Используйте Let's Encrypt для бесплатных SSL сертификатов
- Настройте Nginx или Traefik как reverse proxy
- Принудительный редирект HTTP → HTTPS

### 4. Rate limiting

Добавьте ограничение запросов для защиты от брутфорса:

```java
@Bean
public RateLimiter rateLimiter() {
    return RateLimiter.create(10.0); // 10 запросов в секунду
}
```

### 5. Audit logging

Логируйте все попытки входа:

```java
@EventListener
public void onAuthenticationEvent(AuthenticationEvent event) {
    auditLog.info("Authentication attempt: {} - {}", 
        event.getUsername(), 
        event.isSuccess() ? "SUCCESS" : "FAILED");
}
```

## 📚 Полезные ссылки

- [Spring Security Documentation](https://docs.spring.io/spring-security/reference/)
- [JJWT Library](https://github.com/jwtk/jjwt)
- [BCrypt Password Encoding](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/crypto/bcrypt/BCryptPasswordEncoder.html)
- [JWT Best Practices](https://auth0.com/blog/jwt-authentication-best-practices/)

## ✅ Чек-лист безопасности

- [x] Spring Security настроен
- [x] JWT токены реализованы
- [x] BCrypt хеширование паролей
- [x] Access + Refresh токены
- [x] Защита endpoints по ролям
- [x] CORS настроен
- [x] Stateless сессии
- [ ] Изменить JWT secret для продакшена
- [ ] Настроить HTTPS
- [ ] Добавить rate limiting
- [ ] Настроить audit logging
- [ ] Обновить frontend для работы с JWT
- [ ] Добавить автоматическое обновление токена
- [ ] Добавить logout на backend (blacklist токенов)

---

**Версия:** 1.0  
**Дата:** 15 сентября 2026  
**Статус:** ✅ Реализовано, готово к интеграции с frontend
