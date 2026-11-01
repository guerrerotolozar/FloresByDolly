FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

# Copiamos la build de Angular
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Configuracion de Nginx para Angular (Single Page Application)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
