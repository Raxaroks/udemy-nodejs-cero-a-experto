const argv = require("yargs")
    .option('b', {
        alias: "base",
        type: "number",
        demandOption: true,
        describe: "Base de la table de multiplicar"
    })
    .option('u', {
        alias: "until",
        type: "number",
        default: 10,
        describe: "Límite para la tabla de multiplicar"
    })
    .option('l', {
        alias: "list",
        type: "boolean",
        default: false,
        describe: "Bandera para mostrar una lista con la tabla de multiplicar"
    })
    .check( (argv, options) => {
        if (isNaN(argv.b)) {
            throw "La base tiene que ser un número";
        }
        return true;
    } )
    .argv;

module.exports = argv;