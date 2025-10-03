FROM nginx:1.23-alpine

# Instalar gettext para usar envsubst
RUN apk add --no-cache gettext

# Copiar config y script
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Exponer el puerto de Nginx
EXPOSE 80

# Comando de arranque
CMD ["/start.sh"]
