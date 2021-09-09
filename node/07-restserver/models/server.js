require("colors");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
    constructor() {
        this.app = express(); // iniciar servidor con express
        this.port = process.env.PORT; // puerto

        // rutas
        this.paths = {
            auth: "/api/auth",
            users: "/api/users",
            products: "/api/products",
            categories: "/api/categories",
            search: "/api/search",
            uploads: "/api/uploads"
        };

        // connect to database
        this.connectDB();

        // middlewares
        this.middlewares();

        // rutas de mi aplicación
        this.routes();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use( cors() );

        // lectura y parse del body
        this.app.use( express.json() );

        // servir directorio público
        this.app.use( express.static("public") );

        // carga de archivos
        this.app.use( fileUpload({
            useTempFiles: true,
            tempFileDir: "/tmp/",
            createParentPath: true
        }) );
    }

    routes() {
        this.app.use( this.paths.auth, require("../routes/auth") ); 
        this.app.use( this.paths.users, require("../routes/user") );
        this.app.use( this.paths.products, require("../routes/products") );
        this.app.use( this.paths.categories, require("../routes/categories") );
        this.app.use( this.paths.search, require("../routes/search") );
        this.app.use( this.paths.uploads, require("../routes/uploads") );
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log(`\n --> Servidor ${ "corriendo".green } en el puerto: ${ this.port.cyan }\n`);
        } );
    }
}

module.exports = Server;