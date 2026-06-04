FROM node:22-alpine

RUN apk add --no-cache nginx

WORKDIR /app

#COPY backend ./backend
COPY sites /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY start.sh /start.sh

RUN chmod +x /start.sh

#WORKDIR /app/backend
#RUN npm install

EXPOSE 80

CMD ["/start.sh"]