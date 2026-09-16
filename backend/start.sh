#!/bin/bash

# Скрипт быстрого запуска LMS Азимов
# Использование: ./start.sh

set -e

echo "🚀 Запуск LMS Азимов..."
echo ""

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Проверка Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker не установлен. Установите Docker и попробуйте снова.${NC}"
    exit 1
fi

# Проверка Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose не установлен. Установите Docker Compose и попробуйте снова.${NC}"
    exit 1
fi

# Проверка Java
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java не установлена. Установите Java 21 и попробуйте снова.${NC}"
    exit 1
fi

# Проверка Maven
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}❌ Maven не установлен. Установите Maven и попробуйте снова.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Все зависимости найдены${NC}"
echo ""

# Шаг 1: Поднять инфраструктуру
echo -e "${YELLOW}📦 Шаг 1: Поднимаем инфраструктуру (PostgreSQL, Redis, MinIO)...${NC}"
docker-compose up -d

echo "Ожидание запуска сервисов..."
sleep 10

# Проверка статуса
echo ""
echo -e "${GREEN}✅ Статус контейнеров:${NC}"
docker-compose ps

# Шаг 2: Собрать backend
echo ""
echo -e "${YELLOW}🔨 Шаг 2: Собираем backend...${NC}"
mvn clean package -DskipTests

# Шаг 3: Запустить backend
echo ""
echo -e "${YELLOW}🚀 Шаг 3: Запускаем backend...${NC}"
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}🎉 LMS Азимов запущена!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${YELLOW}📍 Endpoints:${NC}"
echo "  • Backend API:    http://localhost:8080/api"
echo "  • Health Check:   http://localhost:8080/api/actuator/health"
echo "  • MinIO Console:  http://localhost:9001"
echo ""
echo -e "${YELLOW}📊 Тестовые запросы:${NC}"
echo "  curl http://localhost:8080/api/catalog/courses?userId=u3"
echo ""
echo -e "${YELLOW}🔐 Учётные данные:${NC}"
echo "  • PostgreSQL: azimov / azimov_secret"
echo "  • MinIO:      minioadmin / minioadmin"
echo ""
echo -e "${YELLOW}🛑 Для остановки:${NC}"
echo "  • Остановить backend: Ctrl+C"
echo "  • Остановить инфраструктуру: docker-compose down"
echo ""
echo -e "${GREEN}Запускаем backend...${NC}"
echo ""

# Запуск backend
java -jar target/azimov-lms-0.1.0.jar
