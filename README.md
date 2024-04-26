# Actividad: Conectar API Express con MongoDB usando Docker

# Actividad: Conectar API Express con MongoDB usando Docker

## Tabla de Contenido
- [Actividad 1](#actividad-1)
  - [Ejecutar Dockerfile y levantar MongoDB](#1-ejecutar-dockerfile-y-levantar-mongodb)
  - [Dockerfile Explicado](#dockerfile-explicado)
  - [Comprobación del servicio](#2-comprobación-del-servicio)
  - [Logs de contenedores](#3-logs-de-contenedores)

- [Actividad 2](#actividad-2)
  - [Introducción a Docker Compose y redes en Docker](#1-introducción-a-docker-compose-y-redes-en-docker)
  - [Funcionamiento de los End Points](#2-funcionamiento-de-los-end-points)

- [Extras](#extras)
  - [Ejecutar Tests](#ejecutar-tests)

Esta actividad consiste en configurar un entorno de desarrollo en Docker donde una API de Express se conecta a una base de datos MongoDB. Utilizamos un `Dockerfile` para configurar la API y `docker-compose.yml` para manejar ambos servicios: la API y la base de datos.

# Actividad 1

```
Nota: Esta actividad demuestra que, al levantar el contenedor de MongoDB y el Dockerfile de la API de manera independiente, no lograrán conectarse automáticamente debido a que no están configurados en la misma red de Docker. Este escenario subraya la importancia de una configuración adecuada de redes en Docker para permitir la comunicación entre contenedores. 

Siguiente paso: Para configurar correctamente la red y permitir la comunicación entre la API y MongoDB, continúa con la Actividad 2.
```

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


# Actividad 2

```
Nota:
Esta actividad se centra en demostrar el uso y la funcionalidad de docker-compose. Se explicarán las diferentes partes del archivo docker-compose.yml y su impacto en la configuración del entorno.

Objetivo:
Al ejecutar docker-compose up, se levantarán automáticamente tanto la API como la base de datos MongoDB, configuradas para comunicarse entre sí, proporcionando así una API totalmente funcional y conectada.
```

## 1. Introducción a Docker Compose y redes en Docker

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

# 2. Funcionamiento de los End Points

## Mostrar tu nombre en el Index
```url
http://localhost:3001/?nombre=Eric%20Avila
```

## Realizar Operaciones con la API
INSERTAR un nuevo string

Para insertar un nuevo string en la base de datos, realiza una solicitud GET a la siguiente URL:

```url
http://localhost:3001/strings/insertar?contenido=HolaMundo
```

Esta operación debería retornar un estado 201 si el string se inserta correctamente.

## RECUPERAR los strings insertados
Para recuperar todos los strings almacenados en la base de datos, realiza una solicitud GET a la siguiente URL:

```url
http://localhost:3001/strings/recuperar
```
Esta operación debería devolver una lista de todos los strings almacenados junto con un estado 200.

# Extras

## Ejecutar Tests
Para ejecutar las pruebas automatizadas de la API, utiliza el siguiente comando que también generará un informe de cobertura:

```bash
npm test
```

