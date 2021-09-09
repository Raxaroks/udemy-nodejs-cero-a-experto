const express = require('express');
const cors = require('cors');
const { socketController } = require("../sockets/controller");

class Server {
    constructor() {
        this.port = process.env.PORT;

        this.app  = express();
        this.server = require("http").createServer( this.app );
        this.io = require("socket.io")( this.server );

        this.paths = {}

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // sockets
        this.sockets();
    }

    middlewares() {
        // CORS
        this.app.use( cors() );

        // Directorio Público
        this.app.use( express.static('public') );
    }

    routes() {}

    sockets() {
        this.io.on( "connection", socketController );
    }

    listen() {
        this.server.listen( this.port, () => {
            console.log( "\n=============================================".gray);
            console.log( `-> Server listening on port: ${ this.port.green }` );
            console.log( "=============================================\n".gray);
        } );
    }
}



module.exports = Server;