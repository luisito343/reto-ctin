# Usar la imagen oficial de Nginx como base
FROM nginx:alpine

COPY nginx.conf /etc/nginx/templates/default.conf.template

RUN apk add --no-cache gettext

# El comando que se ejecutará al iniciar el contenedor.
# 1. Usa 'envsubst' para leer tu plantilla, reemplazar las variables y crear el archivo final.
# 2. Luego, arranca Nginx en modo 'daemon off' (para que el contenedor no se cierre).
CMD /bin/sh -c "envsubst < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"