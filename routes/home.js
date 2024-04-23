const express = require('express');
const router = express.Router();
const fs = require('fs');
const url = require('url');

// Metodo GET / => Pagina inicial
router.get('/', (req, res) => {
    console.log('Metodo => /');

    // Obtener la URL solicitada
    const urlData = url.parse(req.url, true);
    
    // Obtener el valor del parámetro "nombre" de la URL
    const nombre = urlData.query.nombre || 'invitado';

    // Imprimir el valor del parámetro "nombre" en la URL
    if(nombre.length > 0) {
        console.log('El nombre ingresado en la URL es => ', nombre);
    } else {
        console.log('No se ha enviado el parámetro "nombre" en la URL');
    }
    
    // Leer el archivo HTML
    fs.readFile('./static/index.html', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo index.html:', err);
            res.status(404).send('Archivo no encontrado');
        } else {
            // Reemplazar el marcador de posición con el nombre
            const htmlContent = data.toString().replace('#nombre', nombre);

            // Enviar la respuesta con el HTML modificado
            res.status(200).send(htmlContent);
        }
    });
});

module.exports = router;