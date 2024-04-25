const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const stringsRouter = require('./routes/string');
const home = require('./routes/home');

// Configurar bodyParser para analizar solicitudes POST
app.use(bodyParser.json());


// Usar el router para las rutas relacionadas con strings
// http://localhost:3001/strings/recuperar
// http://localhost:3001/strings/insertar?contenido=HolaMundo
app.use('/strings', stringsRouter);

// Usar el router para las rutas relacionadas con strings
//  http://localhost:3001/?nombre=
app.use('/', home);


// Conexion a MongoDB Container
console.log('process.env.MONGODB_URI => ',process.env.MONGODB_URI)

// Conexion con variable de Entorno local
// const mongoUri = process.env.MONGODB_URI;
// Conexion a contenedor de MongoDB
const mongoUri =process.env.MONGODB_URI || 'mongodb://localhost:27017/prueba' ;


mongoose.connect(mongoUri)
    .then(() => {
        console.info(`Conexion a MongoDB establecida ${mongoUri}`);
        // Inicio de aplicación
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.info(`Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error al conectar a MongoDB:', err);
        process.exit(1);
    });