# ETAPA 1: BUILD (Compilación de Angular)
FROM node:24-alpine AS build
WORKDIR /app

# **CAMBIOS CLAVE:**
# 1. Copia los archivos de dependencia desde la carpeta 'frontend/' del contexto
#    al WORKDIR (/app) del contenedor.
COPY package.json package-lock.json ./

RUN npm install

# 2. Copia todo el contenido restante de la carpeta
COPY . .

RUN npm run build --configuration=production

# ETAPA 2: SERVIDOR (Servir archivos estáticos)
FROM nginx:alpine AS final

# El puerto 80 es el estándar para Nginx
EXPOSE 80 
# NOTA: En tu docker-compose.yml, puedes exponer 4200:80 si lo deseas, 
# pero el puerto interno de Nginx es 80.

COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copia los artefactos compilados
COPY --from=build app/dist/lab_referral_system/browser /usr/share/nginx/html