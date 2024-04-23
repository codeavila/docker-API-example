const mongoose = require('mongoose');

// Definir el esquema del modelo
const stringSchema = new mongoose.Schema({
    contenido: {
        type: String,
        required: true
    }
});

// Crear el modelo
const StringModel = mongoose.model('String', stringSchema);

module.exports = StringModel;
