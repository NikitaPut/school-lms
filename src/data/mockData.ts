import { Course, Module, Lesson, User, AccessRequest, AuditLogEntry } from '../types';

export const mockUsers: User[] = [
  { id: 'u1', email: 'admin@eduvault.ru', fullName: 'Иванов Алексей', role: 'superadmin' },
  { id: 'u2', email: 'methodist@eduvault.ru', fullName: 'Петрова Мария', role: 'methodist' },
  { id: 'u3', email: 'teacher1@eduvault.ru', fullName: 'Сидорова Елена', role: 'teacher' },
  { id: 'u4', email: 'teacher2@eduvault.ru', fullName: 'Козлов Дмитрий', role: 'teacher' },
  { id: 'u5', email: 'teacher3@eduvault.ru', fullName: 'Новикова Анна', role: 'teacher' },
];

export const mockCourses: Course[] = [
  {
    id: 'c1',
    title: 'Основы программирования на Python',
    description: 'Курс для начинающих разработчиков. Изучение синтаксиса, структур данных, ООП и работы с библиотеками.',
    previewUrl: '',
    authorId: 'u2',
    authorName: 'Петрова Мария',
    status: 'ACTIVE',
    moduleCount: 4,
    lessonCount: 12,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'c2',
    title: 'Веб-разработка: HTML, CSS, JavaScript',
    description: 'Полный курс по созданию современных веб-приложений. От вёрстки до интерактивных интерфейсов.',
    previewUrl: '',
    authorId: 'u2',
    authorName: 'Петрова Мария',
    status: 'ACTIVE',
    moduleCount: 5,
    lessonCount: 18,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'c3',
    title: 'Математика для Data Science',
    description: 'Линейная алгебра, теория вероятностей и статистика. Практические задачи на Python.',
    previewUrl: '',
    authorId: 'u2',
    authorName: 'Петрова Мария',
    status: 'ACTIVE',
    moduleCount: 3,
    lessonCount: 9,
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 'c4',
    title: 'Дизайн интерфейсов (UI/UX)',
    description: 'Проектирование пользовательских интерфейсов. Figma, прототипирование, юзабилити-тестирование.',
    previewUrl: '',
    authorId: 'u2',
    authorName: 'Петрова Мария',
    status: 'ACTIVE',
    moduleCount: 4,
    lessonCount: 14,
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'c5',
    title: 'Робототехника для школьников',
    description: 'Arduino, датчики, сервоприводы. Создание собственных роботизированных устройств.',
    previewUrl: '',
    authorId: 'u2',
    authorName: 'Петрова Мария',
    status: 'ACTIVE',
    moduleCount: 6,
    lessonCount: 20,
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'c6',
    title: 'Английский язык для IT',
    description: 'Техническая лексика, чтение документации, подготовка к собеседованиям на английском.',
    previewUrl: '',
    authorId: 'u2',
    authorName: 'Петрова Мария',
    status: 'ACTIVE',
    moduleCount: 3,
    lessonCount: 10,
    color: 'from-amber-500 to-yellow-600',
  },
];

export const mockModules: Module[] = [
  { id: 'm1', courseId: 'c1', title: 'Введение в Python', orderIndex: 1 },
  { id: 'm2', courseId: 'c1', title: 'Структуры данных', orderIndex: 2 },
  { id: 'm3', courseId: 'c1', title: 'Объектно-ориентированное программирование', orderIndex: 3 },
  { id: 'm4', courseId: 'c1', title: 'Работа с библиотеками', orderIndex: 4 },
  { id: 'm5', courseId: 'c2', title: 'Основы HTML', orderIndex: 1 },
  { id: 'm6', courseId: 'c2', title: 'CSS и адаптивная вёрстка', orderIndex: 2 },
  { id: 'm7', courseId: 'c2', title: 'JavaScript: основы', orderIndex: 3 },
  { id: 'm8', courseId: 'c2', title: 'DOM и события', orderIndex: 4 },
  { id: 'm9', courseId: 'c2', title: 'Современный JS (ES6+)', orderIndex: 5 },
];

export const mockLessons: Lesson[] = [
  {
    id: 'l1', moduleId: 'm1', title: 'Установка Python и настройка среды', orderIndex: 1,
    content: '<h2>Установка Python</h2><p>Для начала работы нам необходимо установить интерпретатор Python на ваш компьютер. Перейдите на официальный сайт <strong>python.org</strong> и скачайте последнюю стабильную версию.</p><h3>Шаг 1: Скачивание</h3><p>Выберите версию для вашей операционной системы. Для Windows рекомендуется использовать установщик с официального сайта.</p><h3>Шаг 2: Установка</h3><p>При установке обязательно отметьте галочку "Add Python to PATH". Это позволит запускать Python из командной строки.</p><h3>Шаг 3: Проверка</h3><p>Откройте терминал и выполните команду <code>python --version</code>. Вы должны увидеть номер установленной версии.</p>',
    materials: [
      { id: 'mat1', lessonId: 'l1', type: 'text', title: 'Инструкция по установке', content: 'Подробная инструкция...', orderIndex: 1 },
      { id: 'mat2', lessonId: 'l1', type: 'link', title: 'Официальный сайт Python', content: 'https://python.org', orderIndex: 2 },
    ]
  },
  {
    id: 'l2', moduleId: 'm1', title: 'Первая программа: Hello World', orderIndex: 2,
    content: '<h2>Hello, World!</h2><p>Традиционно изучение любого языка программирования начинается с программы, которая выводит на экран текст "Hello, World!".</p><h3>Ваш первый код</h3><pre><code>print("Hello, World!")</code></pre><p>Функция <code>print()</code> выводит текст в консоль. Текст заключается в кавычки — это строка (string).</p><h3>Запуск программы</h3><p>Создайте файл <code>hello.py</code>, введите код выше и запустите его командой <code>python hello.py</code></p>',
    materials: [
      { id: 'mat3', lessonId: 'l2', type: 'pdf', title: 'Шпаргалка по синтаксису', content: '', orderIndex: 1 },
    ]
  },
  {
    id: 'l3', moduleId: 'm1', title: 'Переменные и типы данных', orderIndex: 3,
    content: '<h2>Переменные в Python</h2><p>Переменная — это именованная область памяти, которая хранит значение. В Python не нужно объявлять тип переменной заранее.</p><h3>Примеры</h3><pre><code>name = "Алексей"\nage = 25\nis_student = True\nheight = 1.75</code></pre><h3>Типы данных</h3><ul><li><strong>str</strong> — строка</li><li><strong>int</strong> — целое число</li><li><strong>float</strong> — дробное число</li><li><strong>bool</strong> — булево значение (True/False)</li></ul>',
    materials: [
      { id: 'mat4', lessonId: 'l3', type: 'text', title: 'Таблица типов данных', content: 'Полная таблица...', orderIndex: 1 },
    ]
  },
  {
    id: 'l4', moduleId: 'm2', title: 'Списки (list)', orderIndex: 1,
    content: '<h2>Списки в Python</h2><p>Список — это упорядоченная изменяемая коллекция элементов.</p><pre><code>fruits = ["яблоко", "банан", "вишня"]\nnumbers = [1, 2, 3, 4, 5]\nmixed = [1, "два", 3.0, True]</code></pre>',
    materials: []
  },
  {
    id: 'l5', moduleId: 'm2', title: 'Словари (dict)', orderIndex: 2,
    content: '<h2>Словари</h2><p>Словарь — это неупорядоченная коллекция пар "ключ-значение".</p><pre><code>student = {\n    "name": "Алексей",\n    "age": 25,\n    "course": "Python"\n}</code></pre>',
    materials: []
  },
];

export const mockAccessRequests: AccessRequest[] = [
  {
    id: 'ar1', userId: 'u4', userName: 'Козлов Дмитрий', courseId: 'c1',
    courseTitle: 'Основы программирования на Python', status: 'PENDING', createdAt: '2026-09-14T10:30:00Z'
  },
  {
    id: 'ar2', userId: 'u5', userName: 'Новикова Анна', courseId: 'c3',
    courseTitle: 'Математика для Data Science', status: 'PENDING', createdAt: '2026-09-14T14:15:00Z'
  },
  {
    id: 'ar3', userId: 'u3', userName: 'Сидорова Елена', courseId: 'c4',
    courseTitle: 'Дизайн интерфейсов (UI/UX)', status: 'APPROVED', createdAt: '2026-09-12T09:00:00Z',
    reviewedBy: 'u1', reviewedAt: '2026-09-12T11:30:00Z'
  },
];

export const mockAuditLog: AuditLogEntry[] = [
  { id: 'a1', userId: 'u3', userName: 'Сидорова Елена', action: 'VIEW_LESSON', resourceType: 'lesson', resourceId: 'l1', ip: '192.168.1.45', userAgent: 'Chrome/120', createdAt: '2026-09-15T09:15:00Z' },
  { id: 'a2', userId: 'u3', userName: 'Сидорова Елена', action: 'REQUEST_ACCESS', resourceType: 'course', resourceId: 'c4', ip: '192.168.1.45', userAgent: 'Chrome/120', createdAt: '2026-09-14T16:20:00Z' },
  { id: 'a3', userId: 'u1', userName: 'Иванов Алексей', action: 'GRANT_ACCESS', resourceType: 'course', resourceId: 'c4', ip: '192.168.1.10', userAgent: 'Firefox/119', createdAt: '2026-09-14T17:00:00Z' },
  { id: 'a4', userId: 'u4', userName: 'Козлов Дмитрий', action: 'LOGIN', resourceType: 'auth', resourceId: '-', ip: '10.0.0.55', userAgent: 'Safari/17', createdAt: '2026-09-15T08:00:00Z' },
  { id: 'a5', userId: 'u1', userName: 'Иванов Алексей', action: 'VIEW_AUDIT_LOG', resourceType: 'system', resourceId: '-', ip: '192.168.1.10', userAgent: 'Firefox/119', createdAt: '2026-09-15T10:00:00Z' },
];

// User course access: teacher u3 has access to c1, c2; teacher u4 has access to c2
export const mockUserCourseAccess: { userId: string; courseId: string; grantedBy: string; grantedAt: string }[] = [
  { userId: 'u3', courseId: 'c1', grantedBy: 'u1', grantedAt: '2026-09-01T10:00:00Z' },
  { userId: 'u3', courseId: 'c2', grantedBy: 'u1', grantedAt: '2026-09-02T11:00:00Z' },
  { userId: 'u3', courseId: 'c4', grantedBy: 'u1', grantedAt: '2026-09-12T11:30:00Z' },
  { userId: 'u4', courseId: 'c2', grantedBy: 'u2', grantedAt: '2026-09-05T09:00:00Z' },
  { userId: 'u5', courseId: 'c5', grantedBy: 'u1', grantedAt: '2026-09-08T14:00:00Z' },
];
