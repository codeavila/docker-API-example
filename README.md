# Actividad: Conectar API Express con MongoDB usando Docker

Esta actividad consiste en configurar un entorno de desarrollo en Docker donde una API de Express se conecta a una base de datos MongoDB. Utilizamos un `Dockerfile` para configurar la API y `docker-compose.yml` para manejar ambos servicios: la API y la base de datos.

## 1. Ejecutar Dockerfile y levantar MongoDB

Primero, iniciamos un contenedor de MongoDB:

```bash
docker run --name myMongo -p 27017:27017 -d mongo:latest
```

Ejecutamos el Dockerfile y creamos la imagen base de la API



# Dockerfile Explicado

El `Dockerfile` prepara la imagen de nuestra aplicación Express:

```Dockerfile
# Use la imagen base de Node.js en Alpine para una imagen más ligera
FROM node:16.20.2-alpine

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar todos los archivos necesarios al directorio de trabajo
COPY . .

# Instalar dependencias del proyecto
RUN npm install

# Exponer el puerto 3001
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["node", "index.js"]
```

Construimos la imagen:

```bash
docker build -t api-docker .
```

Y ejecutamos la instancia de la API en modo "detached" (segundo plano):


```bash
docker run --name api-node -d api-docker
```

## 2. Comprobación del servicio
Visita http://localhost:3001/ para verificar el servicio API.


## 3. Logs de contenedores
Si hay problemas, revisamos los logs para diagnosticar qué podría estar fallando:

```bash
docker logs -f api-node
```

Observamos que, aunque haya un contenedor de MongoDB, el contenedor de la API no puede "verlo".



## 4. Introducción a Docker Compose y redes en Docker

Dado que el contenedor de la API no puede conectar con el de MongoDB, necesitamos configurar una red común. Docker-compose.yml permite gestionar la red y otros aspectos de los contenedores, facilitando la comunicación entre ellos:

```yaml
version: '3.7'
services:
  docker-api:
    build: .
    ports:
      - "3001:3001"
    environment:
      - MONGODB_URI=mongodb://mongo:27017
  mongo:
    image: mongo:latest
```
### Detalles de docker-compose.yml
```
Versión: Especifica la versión de Docker Compose utilizada.

Servicios: Define dos servicios: docker-api (nuestra aplicación Express) y mongo (el servidor de base de datos MongoDB).

Construcción y Puertos: Para docker-api, construye la imagen usando el Dockerfile y mapea el puerto 3001 del host al puerto 3001 del contenedor.

Variables de Entorno: Establece MONGODB_URI para que la API se conecte a MongoDB a través del nombre del servicio mongo, demostrando cómo los servicios en Docker Compose pueden comunicarse usando nombres de servicios como hosts.

Imagen de MongoDB: Utiliza la imagen oficial de MongoDB.
```

Ejecutamos el `Docker Compose`:

```bash
docker compose up
```