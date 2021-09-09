const { makeFile } = require("./helpers/multiply");
const colors = require("colors");
const argv = require("./config/yargs");
console.clear();

console.log( argv );

makeFile(argv.b, argv.l, argv.u)
    .then( result => console.log(result.rainbow) )
    .catch( err => console.log(err) );