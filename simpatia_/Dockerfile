FROM node:22-alpine

RUN apk add --no-cache nginx

WORKDIR /app

# Backend
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Copia o restante
WORKDIR /app
COPY backend ./backend

# Frontend
COPY sites /usr/share/nginx/html

# Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Script de inicialização
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]