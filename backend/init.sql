-- Инициализация базы данных для LMS Азимов

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Таблица курсов
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    preview_url VARCHAR(500),
    author_id VARCHAR(255) REFERENCES users(id),
    author_name VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    module_count INTEGER DEFAULT 0,
    lesson_count INTEGER DEFAULT 0,
    color VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Таблица модулей
CREATE TABLE IF NOT EXISTS modules (
    id VARCHAR(255) PRIMARY KEY,
    course_id VARCHAR(255) REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    order_index INTEGER NOT NULL
);

-- Таблица уроков
CREATE TABLE IF NOT EXISTS lessons (
    id VARCHAR(255) PRIMARY KEY,
    module_id VARCHAR(255) REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    order_index INTEGER NOT NULL,
    content TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Таблица материалов
CREATE TABLE IF NOT EXISTS materials (
    id VARCHAR(255) PRIMARY KEY,
    lesson_id VARCHAR(255) REFERENCES lessons(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    file_url VARCHAR(500),
    order_index INTEGER NOT NULL,
    downloadable BOOLEAN DEFAULT FALSE
);

-- Таблица доступа пользователей к курсам
CREATE TABLE IF NOT EXISTS user_course_access (
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(255) REFERENCES courses(id) ON DELETE CASCADE,
    granted_by VARCHAR(255) REFERENCES users(id),
    granted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, course_id)
);

-- Таблица заявок на доступ
CREATE TABLE IF NOT EXISTS access_requests (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(255) REFERENCES courses(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_by VARCHAR(255) REFERENCES users(id),
    reviewed_at TIMESTAMP
);

-- Таблица прогресса уроков
CREATE TABLE IF NOT EXISTS lesson_progress (
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    lesson_id VARCHAR(255) REFERENCES lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, lesson_id)
);

-- Таблица вопросов
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(255) PRIMARY KEY,
    lesson_id VARCHAR(255) REFERENCES lessons(id) ON DELETE CASCADE,
    user_id VARCHAR(255) REFERENCES users(id),
    user_name VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Таблица ответов
CREATE TABLE IF NOT EXISTS answers (
    id VARCHAR(255) PRIMARY KEY,
    question_id VARCHAR(255) REFERENCES questions(id) ON DELETE CASCADE,
    user_id VARCHAR(255) REFERENCES users(id),
    user_name VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Таблица вложений
CREATE TABLE IF NOT EXISTS attachments (
    id VARCHAR(255) PRIMARY KEY,
    question_id VARCHAR(255) REFERENCES questions(id) ON DELETE CASCADE,
    answer_id VARCHAR(255) REFERENCES answers(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    url VARCHAR(500) NOT NULL,
    name VARCHAR(255) NOT NULL
);

-- Таблица аудита
CREATE TABLE IF NOT EXISTS audit_log (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id),
    user_name VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    ip VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_user_course_access_user ON user_course_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_access_course ON user_course_access(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_materials_lesson ON materials(lesson_id);
CREATE INDEX IF NOT EXISTS idx_questions_lesson ON questions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id, created_at);

-- Тестовые данные: пользователи
-- Пароль для всех: password123 (BCrypt хеш)
INSERT INTO users (id, email, password_hash, full_name, role, status, registered_at) VALUES
('u1', 'admin@azimovclub.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Иванов Алексей', 'ADMIN', 'ACTIVE', '2026-01-15 10:00:00'),
('u2', 'methodist@azimovclub.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Петрова Мария', 'METHODIST', 'ACTIVE', '2026-02-01 14:30:00'),
('u3', 'teacher1@azimovclub.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Сидорова Елена', 'TEACHER', 'ACTIVE', '2026-03-10 09:15:00'),
('u4', 'teacher2@azimovclub.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Козлов Дмитрий', 'TEACHER', 'ACTIVE', '2026-04-05 11:20:00'),
('u5', 'teacher3@azimovclub.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Новикова Анна', 'TEACHER', 'ACTIVE', '2026-05-20 16:45:00')
ON CONFLICT (id) DO NOTHING;

-- Тестовые данные: курсы
INSERT INTO courses (id, title, description, author_id, author_name, status, module_count, lesson_count, color) VALUES
('c1', 'Робототехника (mBlock)', 'Программирование роботов в среде mBlock. От простых алгоритмов до сложных проектов с датчиками и исполнительными механизмами.', 'u2', 'Петрова Мария', 'ACTIVE', 3, 36, 'from-cyan-500 to-blue-600'),
('c2', 'Пайка', 'Основы и продвинутые техники пайки электронных компонентов. Работа с паяльной станцией, SMD-компонентами, создание собственных устройств.', 'u2', 'Петрова Мария', 'ACTIVE', 3, 30, 'from-orange-500 to-red-600'),
('c3', 'Python', 'Изучение языка программирования Python. От базового синтаксиса до ООП, работы с библиотеками и создания полноценных приложений.', 'u2', 'Петрова Мария', 'ACTIVE', 3, 45, 'from-blue-500 to-indigo-600'),
('c4', 'Minecraft: логические конструкции', 'Изучение логики и алгоритмов через создание редстоун-схем в Minecraft. От простых переключателей до сложных вычислительных устройств.', 'u2', 'Петрова Мария', 'ACTIVE', 3, 33, 'from-emerald-500 to-teal-600'),
('c5', 'Разработка 3D игр в Unity Engine', 'Создание трёхмерных игр на Unity. Программирование на C#, работа с физикой, анимацией, UI и оптимизация производительности.', 'u2', 'Петрова Мария', 'ACTIVE', 3, 42, 'from-purple-500 to-pink-600'),
('c6', 'Олимпиадная группа: Робототехника', 'Углублённая подготовка к олимпиадам и соревнованиям по робототехнике. Решение сложных задач, командные проекты.', 'u2', 'Петрова Мария', 'ACTIVE', 2, 20, 'from-cyan-600 to-blue-700'),
('c7', 'Олимпиадная группа: Программирование', 'Подготовка к олимпиадам по программированию. Алгоритмы, структуры данных, решение задач повышенной сложности.', 'u2', 'Петрова Мария', 'ACTIVE', 2, 24, 'from-blue-600 to-indigo-700'),
('c8', 'Олимпиадная группа: GameDev', 'Углублённое изучение разработки игр. Участие в геймджемах, создание портфолио, подготовка к конкурсам.', 'u2', 'Петрова Мария', 'ACTIVE', 2, 18, 'from-purple-600 to-pink-700')
ON CONFLICT (id) DO NOTHING;

-- Тестовые данные: доступы
INSERT INTO user_course_access (user_id, course_id, granted_by, granted_at) VALUES
('u3', 'c1', 'u1', '2026-09-01 10:00:00'),
('u3', 'c2', 'u1', '2026-09-02 11:00:00'),
('u3', 'c4', 'u1', '2026-09-12 11:30:00'),
('u4', 'c3', 'u2', '2026-09-05 09:00:00'),
('u4', 'c5', 'u2', '2026-09-06 10:00:00'),
('u5', 'c4', 'u1', '2026-09-08 14:00:00'),
('u5', 'c7', 'u1', '2026-09-09 15:00:00')
ON CONFLICT (user_id, course_id) DO NOTHING;
