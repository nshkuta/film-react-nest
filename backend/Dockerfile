# Этап сборки
FROM node:18-alpine AS builder

# Установка рабочей директории
WORKDIR /app

# Установка зависимостей для crypto
RUN apk add --no-cache libressl-dev

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка только production зависимостей
RUN npm ci --only=production

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN npm run build

# Этап производства
FROM node:18-alpine

# Установка рабочей директории
WORKDIR /app

# Копирование зависимостей из этапа сборки
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Скопируйте статические файлы
COPY public /app/public

# Установите правильные права доступа
RUN chmod -R 755 /app/public

# Установка необходимых библиотек
RUN apk add --no-cache libressl-dev

# Экспозиция порта
EXPOSE 3000

# Определение команды запуска
CMD ["node", "dist/main"]
