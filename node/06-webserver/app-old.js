

const http = require("http");

http.createServer( ( req, res ) => {

    console.clear();
    console.log( req );

    res.setHeader( "Content-Disposition", "attachment; filename=lista.csv" )
    res.writeHead( 200, {
        "Content-Type": "application/csv"
    } );

    res.write( "id, nombre\n" );
    res.write( "1, Andres\n" );
    res.write( "2, Fernanda\n" );
    res.write( "3, Nadia\n" );
    res.end();

} ).listen( 8080 );

console.log("Escuchando en el puerto", 8080);
