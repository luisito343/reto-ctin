FROM nginx:1.23-alpine

# Instalar gettext para envsubst
RUN apk add --no-cache gettext

# Copiar config y script
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]
