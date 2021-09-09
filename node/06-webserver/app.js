require("dotenv").config();
const hbs = require("hbs");
const express = require("express");

const app = express();
const port = process.env.PORT;

// Handlebars
app.set("view engine", "hbs");
hbs.registerPartials( __dirname + "/views/partials" );

app.use( express.static("public") );

app.get( "/", ( req, res ) => {
    res.render("home", {
        username: "Andrés Ornelas",
        title: "Curso de NodeJS"
    });
} );

app.get( "/generic", ( req, res ) => {
    res.render("generic", {
        username: "Andrés Ornelas",
        title: "Curso de NodeJS"
    });
} );

app.get( "/elements", ( req, res ) => {
    res.render("elements", {
        username: "Andrés Ornelas",
        title: "Curso de NodeJS"
    });
} );

// app.get( "/", ( req, res ) => {
//     res.send("Home page")
// } );

// app.get( "/hello", ( req, res ) => {
//     res.send("Hello world :D")
// } );

// app.get( "*", ( req, res ) => {
//     res.sendFile( __dirname + "/public/404.html" )
// } );

app.listen( port, () => {
    console.clear();
    console.log( `App listening at http://localhost:${ port }` );
} );