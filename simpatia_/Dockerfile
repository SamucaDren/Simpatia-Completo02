FROM node:22-alpine

# Instala nginx + dependências necessárias pro Puppeteer não quebrar
RUN apk add --no-cache \
    nginx \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Diretório base
WORKDIR /app

# =========================
# BACKEND
# =========================
WORKDIR /app/backend

COPY backend/package*.json ./

# Instala dependências (evita rebuild quebrado)
RUN npm install

# Copia o resto do backend
COPY backend ./

# Puppeteer config (evita download de chrome)
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# =========================
# FRONTEND (STATIC)
# =========================
WORKDIR /app

COPY sites /usr/share/nginx/html

# =========================
# NGINX CONFIG
# =========================
COPY nginx.conf /etc/nginx/nginx.conf

# =========================
# START SCRIPT
# =========================
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]