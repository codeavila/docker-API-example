# Use la imagen base de Node.js en Alpine
FROM node:16.20.2-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar los archivos necesarios al contenedor
# COPY package*.json ./
# COPY index.js ./
# COPY static ./static
COPY . .

# Establecer la variable de entorno MONGODB_URI
# ENV MONGODB_URI

# Instalar las dependencias
RUN npm install

# Exponer el puerto que la aplicación va a utilizar
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["node", "index.js"]
