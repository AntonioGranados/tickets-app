const express = require('express');
const cors = require('cors');
const { socketController } = require('../sockets/controller');

//creamos la clase server
class Server {
    //definimos las propiedades que tendra la clase Server en el constructor
    constructor() {
        //creamos la app de express como propiedad de la clase Server
        this.app = express();

        //definimos el puerto como propiedad de la clase Server
        this.puerto = process.env.PORT;

        //definimos el servidor http de node con el metodo createServer
        this.server = require('http').createServer(this.app);

        //Aquí con la propiedad io tendremos toda la informacion de los sockets conectados
        this.io = require('socket.io')(this.server);

        //Objeto con las rutas
        this.paths = {}

        //Middlewares
        this.middlewares();

        //llamamos el metodo routes | Rutas de mi aplicación
        this.routes();

        //configuracion de eventos por sockets
        this.eventosDeSockets();
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        //directorio publico
        this.app.use(express.static('public'));
    }

    //Método routes para definir las rutas
    routes() {}

    //Metodo para definir los eventos de sockets
    eventosDeSockets() {
        this.io.on('connection', socketController);
    }

    //Metodo para lanzar el servidor definiendo el puerto
    listen() {
        this.server.listen(this.puerto, () => {
            console.log(`Servidor escuchando en el puerto ${this.puerto}`);
        });
    }
}

//Exportamos el server para usarlo por fuera
module.exports = Server;