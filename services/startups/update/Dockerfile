# Usar una imagen base de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar los archivos de manifiesto (package.json y package-lock.json)
COPY package*.json ./

# Instalar las dependencias de producción con npm
RUN npm install --only=production

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto en el que correrá la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD [ "node", "index.js" ]