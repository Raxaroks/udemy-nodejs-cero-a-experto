import "colors";
import express, { Application } from "express";
import cors from "cors";
import userRoutes from "../routes/user";
import db from "../database/connection";

class Server {
    private app: Application;
    private port: string;
    private APIRestPaths = {
        users: "/api/users",
    };

    constructor() {
        this.app = express();
        this.port = process.env.PORT || "8000";

        this.dbConnection();
        this.middlewares();
        this.routes();
    }

    async dbConnection() {
        try {
            await db.authenticate();
            console.log( `[!] Server has ${ "successfully connected".green } to the database` );            
            console.log( "======================================================\n\n".gray );
        } 
        
        catch ( error: any ) {
            console.log( `[!] Server ${ "can't connect".red } to the database\n` );
            throw new Error( error );
        }
    }

    middlewares() {
        // CORS
        this.app.use( cors() );

        // parseo del body
        this.app.use( express.json() );

        // carpeta pública
        this.app.use( express.static("public") );
    }

    routes() {
        this.app.use( this.APIRestPaths.users, userRoutes );
    }

    listen() {      
        this.app.listen( this.port, () => {
            console.log( "\n======================================================".gray );
            console.log( `[!] Server ${ "running and listening".green } on port ${ this.port.cyan }\n` );
        } );
    }
}



export default Server;