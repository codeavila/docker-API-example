const express = require('express');
const router = express.Router();
const StringModel = require('../models/modelString');

// Ruta para insertar un string en la base de datos
router.get('/insertar', async (req, res) => {
    console.log('Metodo => /insertar');
    try {
        const { contenido } = req.query;

        if (!contenido) {
            console.error('No se proporcionó ningún contenido.');
            return res.status(400).json({ error: 'No se proporcionó ningún contenido.' });
        }

        const nuevoString = new StringModel({ contenido });
        await nuevoString.save();

        console.info(`Se ha insertardo: ${nuevoString} correctamente en la base de datos`);
        res.status(201).json({ message: 'String insertado correctamente en la base de datos.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Ruta para recuperar el contenido insertado
router.get('/recuperar', async (req, res) => {
    console.log('Metodo => /recuperar');
    try {
        const strings = await StringModel.find();
        res.status(200).json({ strings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
