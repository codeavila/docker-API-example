const request = require('supertest');
const express = require('express');
const StringModel = require('../models/modelString');
const router = require('../routes/string');

const app = express();
app.use(express.json());
app.use('/', router);

// Mock de la dependencia de StringModel
jest.mock('../models/modelString');


describe('Test de las rutas del String API', () => {
    beforeEach(() => {
        // Limpiar todas las instancias y llamadas a constructor y todos los métodos de mocks:
        jest.clearAllMocks();
    
        // Configurar el mock del método save
        StringModel.prototype.save = jest.fn().mockImplementation(function() {
            return Promise.resolve(this);
        });
    
        // Configurar el mock del método find
        StringModel.find = jest.fn().mockResolvedValue([{ contenido: 'Test string' }]);
    });

    test('POST /insertar - error si no se proporciona contenido', async () => {
        const contenido = "Este-es-un-ejemplo-de-contenido";
        const response = await request(app)
            .get('/insertar') // Asegúrate de que el método sea correcto, aquí se usa get como en tu ruta.
            .query({ contenido }) // Pasando el contenido como parte de la query string.
    
        expect(response.status).toBe(201); // Asegúrate de que el código de estado esperado sea el correcto.
        expect(response.body.message).toEqual('String insertado correctamente en la base de datos.');
    });

    describe('Test de la ruta /insertar', () => {
    test('GET /insertar - error si no se proporciona contenido', async () => {
        const response = await request(app)
            .get('/insertar') // Usando GET según tu definición de la ruta
            .query({}); // No incluir 'contenido' en la query simula el envío vacío

        // Verificar que el código de estado es 400, indicativo de una solicitud incorrecta
        expect(response.status).toBe(400);
        // Verificar que la respuesta del error sea la esperada
        expect(response.body.error).toEqual('No se proporcionó ningún contenido.');
    });
});
    

    test('GET /recuperar - devuelve todos los strings', async () => {
        
        const response = await request(app).get('/recuperar');
    
        expect(response.status).toBe(200);
        expect(response.body.strings).toEqual([{ contenido: 'Test string' }]);
    });
    
});
