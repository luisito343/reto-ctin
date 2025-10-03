#!/bin/sh

# Sustituye todas las variables en nginx.conf.template
envsubst '
${CREATE_STARTUP_URL}
${READ_STARTUP_URL}
${UPDATE_STARTUP_URL}
${DELETE_STARTUP_URL}
${CREATE_TECHNOLOGY_URL}
${READ_TECHNOLOGY_URL}
${UPDATE_TECHNOLOGY_URL}
${DELETE_TECHNOLOGY_URL}
' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf

echo "✅ Nginx config generada con variables sustituidas:"
cat /etc/nginx/conf.d/default.conf

# Inicia Nginx en foreground (para que el contenedor no muera)
nginx -g 'daemon off;'
