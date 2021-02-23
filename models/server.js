const express = require('express');

const cors = require('cors');
// PARA LAS RUTAS
const app = express();

// IMPORTAMOS LA CONEXION A LA BASE DE DATOS
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        //Aqui cogerá el puerto de .env con el dotenv
        this.port = process.env.PORT;
        //esta sera la ruta 
        this.usuariosPath = '/api/usuarios';

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {
        //.use es la palabra clave para usar middleware
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio Público
        this.app.use(express.static('public'));

    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    escucha() {

        this.app.listen(this.port, () => {
            console.log('Puerto Ready', this.port);
        });
    }

}




module.exports = Server;