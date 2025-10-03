#!/bin/sh

# Sustituye variables en el template
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

echo "✅ Configuración de Nginx generada:"
cat /etc/nginx/conf.d/default.conf

# Inicia Nginx
nginx -g 'daemon off;'

