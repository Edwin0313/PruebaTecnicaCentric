# Etapa 1: Construcción
FROM node:20-alpine AS build
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código y compilar
COPY . .
RUN npm run build -- --configuration production

# Etapa 2: Servidor de Producción
FROM nginx:stable-alpine
# Copiamos el resultado de la compilación (ajusta la ruta si tu proyecto se llama distinto)
COPY --from=build /app/dist/centric-frontend/browser /usr/share/nginx/html

# Copiamos una configuración básica de Nginx para manejar rutas de Angular
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]