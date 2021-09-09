// necessary imports
import "colors";
import dotenv from "dotenv";

// dotenv: configuring enviroment variables
dotenv.config();

// model imports
import Server from "./models/server";


// init server
const server = new Server();
console.log( `\n\n\t .::: ${ " TS-REST-Server 0.1.0 ".bgMagenta.white } :::.` );
server.listen();