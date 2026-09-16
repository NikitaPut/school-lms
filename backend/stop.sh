#!/bin/bash

# Скрипт остановки LMS Азимов
# Использование: ./stop.sh

set -e

echo "🛑 Остановка LMS Азимов..."
echo ""

# Остановить Docker контейнеры
echo "Останавливаем инфраструктуру..."
docker-compose down

echo ""
echo "✅ Все сервисы остановлены"
echo ""
echo "Данные сохранены в Docker volumes."
echo "Для полного удаления данных: docker-compose down -v"
