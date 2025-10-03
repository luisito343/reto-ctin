# Usar la imagen oficial de Nginx como base
# Usar la imagen oficial de Nginx
FROM nginx:stable-alpine

# Eliminar la configuración por defecto
RUN rm /etc/nginx/conf.d/default.conf

# Copiar nuestro template y el script de inicio
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY start.sh /start.sh

# Dar permisos de ejecución al script
RUN chmod +x /start.sh

# Comando que se ejecutará cuando el contenedor inicie
CMD ["/start.sh"]