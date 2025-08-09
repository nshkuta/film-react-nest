# Берем слепок из образа node
FROM node:20-alpine AS builder

# указываем рабочую директорию и сохраняем новый слой
WORKDIR /var/www/app

# Копируем в предыдущий слой файлы из текущей директории и сохраняем новый
COPY . .

# На предыдущем слое вызываем команду npm install и сохраняем новый
RUN npm install

# На предыдущем слое вызываем команду npm run build и сохраняем новый
RUN npm run build 

# Финальный этап
FROM nginx:stable-alpine

COPY --from=builder /var/www/app/dist /usr/share/nginx/html

EXPOSE 80
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /var/cache/apk/*