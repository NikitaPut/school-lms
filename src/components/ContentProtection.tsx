import { useEffect } from 'react';

export default function ContentProtection() {
  useEffect(() => {
    // Блокировка правого клика
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Блокировка горячих клавиш
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 - DevTools
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+I / Cmd+Option+I - DevTools
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+J / Cmd+Option+J - Консоль
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+C / Cmd+Option+C - Инспектор элементов
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }

      // Ctrl+U / Cmd+U - Просмотр исходного кода
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        return false;
      }

      // Ctrl+S / Cmd+S - Сохранить страницу
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        return false;
      }

      // Ctrl+P / Cmd+P - Печать
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        return false;
      }

      // Ctrl+A / Cmd+A - Выделить всё
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        return false;
      }

      // Ctrl+C / Cmd+C - Копировать
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        return false;
      }

      // Ctrl+X / Cmd+X - Вырезать
      if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
        e.preventDefault();
        return false;
      }

      // PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        // Попытка очистить буфер обмена
        navigator.clipboard.writeText('').catch(() => {});
        alert('Скриншоты запрещены');
        return false;
      }

      // Ctrl+Shift+K / Cmd+Option+K - Консоль в Firefox
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+M - Режим устройства
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        return false;
      }
    };

    // Блокировка выделения текста
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Блокировка перетаскивания изображений
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Блокировка копирования
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Блокировка вырезания
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Добавление обработчиков
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);

    // Добавление CSS для запрета выделения
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);

    // Очистка при размонтировании
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.head.removeChild(style);
    };
  }, []);

  return null;
}
