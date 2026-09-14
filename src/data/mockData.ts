import { Course, Module, Lesson, User, AccessRequest, AuditLogEntry } from '../types';

export const mockUsers: User[] = [
  { id: 'u1', email: 'admin@azimovclub.com', fullName: 'Иванов Алексей', role: 'superadmin' },
  { id: 'u2', email: 'methodist@azimovclub.com', fullName: 'Петрова Мария', role: 'methodist' },
  { id: 'u3', email: 'teacher1@azimovclub.com', fullName: 'Сидорова Елена', role: 'teacher' },
  { id: 'u4', email: 'teacher2@azimovclub.com', fullName: 'Козлов Дмитрий', role: 'teacher' },
  { id: 'u5', email: 'teacher3@azimovclub.com', fullName: 'Новикова Анна', role: 'teacher' },
];

export const mockCourses: Course[] = [
  // Основные курсы - 3 года обучения
  {
    id: 'c1',
    title: 'Робототехника (mBlock)',
    description: 'Программирование роботов в среде mBlock. От простых алгоритмов до сложных проектов с датчиками и исполнительными механизмами.',
    previewUrl: '',
    authorId: 'u2',
    authorName: 'Петрова Мария',
    status: 'ACTIVE',
    moduleCount: 3,
    lessonCount: 36,
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'c2',
    title: 'Пайка',
    description: 'Основы и продвинутые техники пайки электронных компонентов. Работа с паяльной станцией, SMD-компонентами, создание собственных устройств.',
    previewUrl: '',
    authorId: 'u2',
    authorName: 'Петрова Мария',
    status: 'ACTIVE',
    moduleCount: 3,
    lessonCount: 30,
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'c3',
    title: 'Python',
    description: 'Изучение языка программирования Python. От базового синтаксиса до ООП, работы с библиотеками и создания полноценных приложений.',
    previewUrl: '',
    authorId: 'u2',
    authorName: 'Петрова Мария',
    status: 'ACTIVE',
    moduleCount: 3,
    lessonCount: 45,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'c4',
    title: 'Minecraft: логические конструкции',
    description: 'Изучение логики и алгоритмов через создание редстоун-схем в Minecraft. От простых переключателей до сложных вычислительных устройств.',
    previewUrl: '',
    authorId: 'u2',
    authorName: 'Петрова Мария',
    status: 'ACTIVE',
    moduleCount: 3,
    lessonCount: 33,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'c5',
    title: 'Разработка 3D игр в Unity Engine',
    description: 'Создание трёхмерных игр на Unity. Программирование на C#, работа с физикой, анимацией, UI и оптимизация производительности.',
    previewUrl: '',
    authorId: 'u2',
    authorName: 'Петрова Мария',
    status: 'ACTIVE',
    moduleCount: 3,
    lessonCount: 42,
    color: 'from-purple-500 to-pink-600',
  },
  // Олимпиадные группы
  {
    id: 'c6',
    title: 'Олимпиадная группа: Робототехника',
    description: 'Углублённая подготовка к олимпиадам и соревнованиям по робототехнике. Решение сложных задач, командные проекты.',
    previewUrl: '',
    authorId: 'u2',
    authorName: 'Петрова Мария',
    status: 'ACTIVE',
    moduleCount: 2,
    lessonCount: 20,
    color: 'from-cyan-600 to-blue-700',
  },
  {
    id: 'c7',
    title: 'Олимпиадная группа: Программирование',
    description: 'Подготовка к олимпиадам по программированию. Алгоритмы, структуры данных, решение задач повышенной сложности.',
    previewUrl: '',
    authorId: 'u2',
    authorName: 'Петрова Мария',
    status: 'ACTIVE',
    moduleCount: 2,
    lessonCount: 24,
    color: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'c8',
    title: 'Олимпиадная группа: GameDev',
    description: 'Углублённое изучение разработки игр. Участие в геймджемах, создание портфолио, подготовка к конкурсам.',
    previewUrl: '',
    authorId: 'u2',
    authorName: 'Петрова Мария',
    status: 'ACTIVE',
    moduleCount: 2,
    lessonCount: 18,
    color: 'from-purple-600 to-pink-700',
  },
];

export const mockModules: Module[] = [
  // Робототехника (mBlock)
  { id: 'm1', courseId: 'c1', title: '1 год обучения — Основы mBlock и робототехники', orderIndex: 1 },
  { id: 'm2', courseId: 'c1', title: '2 год обучения — Продвинутые проекты с датчиками', orderIndex: 2 },
  { id: 'm3', courseId: 'c1', title: '3 год обучения — Инженерные задачи и автономные системы', orderIndex: 3 },
  // Пайка
  { id: 'm4', courseId: 'c2', title: '1 год обучения — Основы пайки и работа с инструментом', orderIndex: 1 },
  { id: 'm5', courseId: 'c2', title: '2 год обучения — SMD-компоненты и схемы средней сложности', orderIndex: 2 },
  { id: 'm6', courseId: 'c2', title: '3 год обучения — Проектирование и сборка собственных устройств', orderIndex: 3 },
  // Python
  { id: 'm7', courseId: 'c3', title: '1 год обучения — Основы Python и алгоритмическое мышление', orderIndex: 1 },
  { id: 'm8', courseId: 'c3', title: '2 год обучения — ООП, структуры данных, работа с API', orderIndex: 2 },
  { id: 'm9', courseId: 'c3', title: '3 год обучения — Разработка приложений и проектов', orderIndex: 3 },
  // Minecraft
  { id: 'm10', courseId: 'c4', title: '1 год обучения — Основы редстоуна и логические элементы', orderIndex: 1 },
  { id: 'm11', courseId: 'c4', title: '2 год обучения — Комбинационные схемы и автоматизация', orderIndex: 2 },
  { id: 'm12', courseId: 'c4', title: '3 год обучения — Вычислительные устройства и проекты', orderIndex: 3 },
  // Unity
  { id: 'm13', courseId: 'c5', title: '1 год обучения — Основы Unity и C#', orderIndex: 1 },
  { id: 'm14', courseId: 'c5', title: '2 год обучения — Физика, анимация, UI и звук', orderIndex: 2 },
  { id: 'm15', courseId: 'c5', title: '3 год обучения — Оптимизация, мультиплеер, публикация', orderIndex: 3 },
  // Олимпиадные группы
  { id: 'm16', courseId: 'c6', title: 'Теоретическая подготовка', orderIndex: 1 },
  { id: 'm17', courseId: 'c6', title: 'Практика и соревнования', orderIndex: 2 },
  { id: 'm18', courseId: 'c7', title: 'Алгоритмы и структуры данных', orderIndex: 1 },
  { id: 'm19', courseId: 'c7', title: 'Решение олимпиадных задач', orderIndex: 2 },
  { id: 'm20', courseId: 'c8', title: 'Продвинутый GameDev', orderIndex: 1 },
  { id: 'm21', courseId: 'c8', title: 'Геймджемы и портфолио', orderIndex: 2 },
];

export const mockLessons: Lesson[] = [
  // Робототехника - 1 год
  {
    id: 'l1', moduleId: 'm1', title: 'Знакомство с mBlock и интерфейсом среды', orderIndex: 1,
    content: '<h2>Что такое mBlock?</h2><p>mBlock — это визуальная среда программирования на основе Scratch 3.0, адаптированная для работы с роботами Makeblock. Она позволяет создавать программы из блоков, не написав ни строчки кода.</p><h3>Установка mBlock</h3><p>Скачайте последнюю версию с официального сайта <strong>mblock.cc</strong>. Программа работает на Windows, macOS и Linux.</p><h3>Интерфейс программы</h3><p>Основные элементы интерфейса:</p><ul><li><strong>Сцена</strong> — область, где работает ваш робот</li><li><strong>Палитра блоков</strong> — все доступные команды</li><li><strong>Область скриптов</strong> — здесь собираете программу</li><li><strong>Спрайты</strong> — объекты, которыми управляете</li></ul>',
    materials: [
      { id: 'mat1', lessonId: 'l1', type: 'link', title: 'Скачать mBlock', content: 'https://www.mblock.cc', orderIndex: 1 },
      { id: 'mat2', lessonId: 'l1', type: 'pdf', title: 'Инструкция по установке', content: '', orderIndex: 2 },
    ]
  },
  {
    id: 'l2', moduleId: 'm1', title: 'Первая программа: движение робота', orderIndex: 2,
    content: '<h2>Создаём первую программу</h2><p>Начнём с простой задачи — заставим робота двигаться вперёд.</p><h3>Блоки движения</h3><p>В палитре блоков найдите категорию <strong>"Движение"</strong>. Там вы найдёте:</p><ul><li><code>идти 10 шагов</code> — движение вперёд</li><li><code>повернуть на 15 градусов</code> — поворот</li><li><code>перейти в x: y:</code> — перемещение в точку</li></ul><h3>Практика</h3><p>Соберите программу, которая:</p><ol><li>Двигает робота вперёд на 100 шагов</li><li>Поворачивает на 90 градусов</li><li>Повторяет 4 раза (квадрат)</li></ol>',
    materials: []
  },
  {
    id: 'l3', moduleId: 'm1', title: 'Циклы и условия', orderIndex: 3,
    content: '<h2>Циклы в mBlock</h2><p>Циклы позволяют повторять действия многократно.</p><h3>Блок "повторить N раз"</h3><pre><code>повторить (10) раз\n  идти 10 шагов\n  ждать 0.1 секунды\nконец</code></pre><h3>Условия</h3><p>Блок <strong>"если...то"</strong> выполняет действия только при выполнении условия:</p><pre><code>если &lt;касается края?&gt; то\n  повернуть на 180 градусов\nконец</code></pre>',
    materials: []
  },
  // Робототехника - 2 год
  {
    id: 'l4', moduleId: 'm2', title: 'Работа с датчиками', orderIndex: 1,
    content: '<h2>Датчики в робототехнике</h2><p>Датчики позволяют роботу воспринимать окружающий мир и реагировать на изменения.</p><h3>Основные типы датчиков</h3><ul><li><strong>Ультразвуковой</strong> — измеряет расстояние до объекта</li><li><strong>Инфракрасный</strong> — обнаруживает препятствия</li><li><strong>Датчик линии</strong> — следует по линии</li><li><strong>Датчик света</strong> — измеряет освещённость</li></ul>',
    materials: []
  },
  {
    id: 'l5', moduleId: 'm2', title: 'Создание робота-следопыта', orderIndex: 2,
    content: '<h2>Робот, следующий по линии</h2><p>В этом уроке создадим робота, который автоматически движется по чёрной линии на белом фоне.</p><h3>Алгоритм</h3><ol><li>Датчик линии определяет положение</li><li>Если линия слева — поворот влево</li><li>Если линия справа — поворот вправо</li><li>Если линия по центру — движение прямо</li></ol>',
    materials: []
  },
  // Python - 1 год
  {
    id: 'l6', moduleId: 'm7', title: 'Установка Python и настройка среды', orderIndex: 1,
    content: '<h2>Установка Python</h2><p>Для начала работы нам необходимо установить интерпретатор Python на ваш компьютер. Перейдите на официальный сайт <strong>python.org</strong> и скачайте последнюю стабильную версию.</p><h3>Шаг 1: Скачивание</h3><p>Выберите версию для вашей операционной системы.</p><h3>Шаг 2: Установка</h3><p>При установке обязательно отметьте галочку "Add Python to PATH".</p><h3>Шаг 3: Проверка</h3><p>Откройте терминал и выполните команду <code>python --version</code>.</p>',
    materials: [
      { id: 'mat3', lessonId: 'l6', type: 'link', title: 'Официальный сайт Python', content: 'https://python.org', orderIndex: 1 },
    ]
  },
  {
    id: 'l7', moduleId: 'm7', title: 'Первая программа: Hello World', orderIndex: 2,
    content: '<h2>Hello, World!</h2><p>Традиционно изучение любого языка программирования начинается с программы, которая выводит на экран текст "Hello, World!".</p><h3>Ваш первый код</h3><pre><code>print("Hello, World!")</code></pre><p>Функция <code>print()</code> выводит текст в консоль.</p>',
    materials: []
  },
  {
    id: 'l8', moduleId: 'm7', title: 'Переменные и типы данных', orderIndex: 3,
    content: '<h2>Переменные в Python</h2><p>Переменная — это именованная область памяти, которая хранит значение.</p><h3>Примеры</h3><pre><code>name = "Алексей"\nage = 25\nis_student = True\nheight = 1.75</code></pre><h3>Типы данных</h3><ul><li><strong>str</strong> — строка</li><li><strong>int</strong> — целое число</li><li><strong>float</strong> — дробное число</li><li><strong>bool</strong> — булево значение</li></ul>',
    materials: []
  },
  // Unity - 1 год
  {
    id: 'l9', moduleId: 'm13', title: 'Знакомство с Unity Engine', orderIndex: 1,
    content: '<h2>Что такое Unity?</h2><p>Unity — это кроссплатформенный игровой движок, позволяющий создавать 2D и 3D игры для различных платформ: PC, мобильные устройства, консоли, VR/AR.</p><h3>Установка Unity Hub</h3><p>Скачайте Unity Hub с официального сайта <strong>unity.com</strong>. Через Hub вы будете управлять версиями Unity и проектами.</p><h3>Интерфейс Unity</h3><p>Основные окна:</p><ul><li><strong>Scene</strong> — 3D-вид вашей сцены</li><li><strong>Game</strong> — вид от камеры (как будет выглядеть игра)</li><li><strong>Hierarchy</strong> — список всех объектов в сцене</li><li><strong>Inspector</strong> — свойства выбранного объекта</li><li><strong>Project</strong> — файлы вашего проекта</li></ul>',
    materials: [
      { id: 'mat4', lessonId: 'l9', type: 'link', title: 'Скачать Unity', content: 'https://unity.com/download', orderIndex: 1 },
    ]
  },
  {
    id: 'l10', moduleId: 'm13', title: 'Создание первого проекта', orderIndex: 2,
    content: '<h2>Новый 3D-проект</h2><p>Создадим простой проект с кубом, который можно двигать.</p><h3>Шаги</h3><ol><li>В Unity Hub нажмите "New Project"</li><li>Выберите шаблон "3D"</li><li>Укажите название и папку</li><li>Нажмите "Create project"</li></ol><h3>Добавление объектов</h3><p>В меню <strong>GameObject → 3D Object → Cube</strong> добавьте куб на сцену.</p>',
    materials: []
  },
  // Minecraft - 1 год
  {
    id: 'l11', moduleId: 'm10', title: 'Введение в редстоун', orderIndex: 1,
    content: '<h2>Что такое редстоун?</h2><p>Редстоун — это материал в Minecraft, который позволяет создавать электрические цепи и логические устройства. Это аналог реальных электрических схем.</p><h3>Основные элементы</h3><ul><li><strong>Редстоун-пыль</strong> — передаёт сигнал</li><li><strong>Рычаг</strong> — источник сигнала</li><li><strong>Факел</strong> — инвертирует сигнал</li><li><strong>Повторитель</strong> — усиливает и задерживает сигнал</li></ul>',
    materials: []
  },
  {
    id: 'l12', moduleId: 'm10', title: 'Логические элементы: И, ИЛИ, НЕ', orderIndex: 2,
    content: '<h2>Базовая логика</h2><p>С помощью редстоуна можно создать все базовые логические элементы.</p><h3>Элемент НЕ (инвертор)</h3><p>Используется редстоун-факел. Когда вход есть — выход выключен, и наоборот.</p><h3>Элемент И</h3><p>Два рычага подключены к одному блоку. Выход активен только когда оба рычага включены.</p><h3>Элемент ИЛИ</h3><p>Два рычага подключены параллельно. Выход активен когда хотя бы один рычаг включён.</p>',
    materials: []
  },
];

export const mockAccessRequests: AccessRequest[] = [
  {
    id: 'ar1', userId: 'u4', userName: 'Козлов Дмитрий', courseId: 'c1',
    courseTitle: 'Робототехника (mBlock)', status: 'PENDING', createdAt: '2026-09-14T10:30:00Z'
  },
  {
    id: 'ar2', userId: 'u5', userName: 'Новикова Анна', courseId: 'c3',
    courseTitle: 'Python', status: 'PENDING', createdAt: '2026-09-14T14:15:00Z'
  },
  {
    id: 'ar3', userId: 'u3', userName: 'Сидорова Елена', courseId: 'c5',
    courseTitle: 'Разработка 3D игр в Unity Engine', status: 'APPROVED', createdAt: '2026-09-12T09:00:00Z',
    reviewedBy: 'u1', reviewedAt: '2026-09-12T11:30:00Z'
  },
  {
    id: 'ar4', userId: 'u4', userName: 'Козлов Дмитрий', courseId: 'c6',
    courseTitle: 'Олимпиадная группа: Робототехника', status: 'PENDING', createdAt: '2026-09-15T09:00:00Z'
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
  // Сидорова Елена (teacher1) имеет доступ к Робототехнике, Пайке и Minecraft
  { userId: 'u3', courseId: 'c1', grantedBy: 'u1', grantedAt: '2026-09-01T10:00:00Z' },
  { userId: 'u3', courseId: 'c2', grantedBy: 'u1', grantedAt: '2026-09-02T11:00:00Z' },
  { userId: 'u3', courseId: 'c4', grantedBy: 'u1', grantedAt: '2026-09-12T11:30:00Z' },
  // Козлов Дмитрий (teacher2) имеет доступ к Python и Unity
  { userId: 'u4', courseId: 'c3', grantedBy: 'u2', grantedAt: '2026-09-05T09:00:00Z' },
  { userId: 'u4', courseId: 'c5', grantedBy: 'u2', grantedAt: '2026-09-06T10:00:00Z' },
  // Новикова Анна (teacher3) имеет доступ к Minecraft и олимпиадной группе по программированию
  { userId: 'u5', courseId: 'c4', grantedBy: 'u1', grantedAt: '2026-09-08T14:00:00Z' },
  { userId: 'u5', courseId: 'c7', grantedBy: 'u1', grantedAt: '2026-09-09T15:00:00Z' },
];
