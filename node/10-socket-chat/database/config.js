
const mongoose = require("mongoose");

const dbConnection = async () => {
    try {    
        await mongoose.connect( process.env.MONGODB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        } );

        console.log( "-> Conexión con la base de datos:", "EXITOSA!!!".green );
        console.log( "========================================================\n".cyan );
    } 
    
    catch (error) { 
        console.log( error );
        throw new Error("Error al inicializar la conexión con la base de datos.")
    }
}

module.exports = { dbConnection }