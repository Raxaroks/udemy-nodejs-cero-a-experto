// imports requeridos y configuraciones
require("dotenv").config();
require("colors");

const Server = require("./models/server");

// creamos un servidor
const server = new Server();

// inicializamos el servidor
server.listen();