const path = require("path");
const { v4: uuidv4 } = require("uuid");


const uploadFile = ( 
        files, 
        validExtensions = ["png", "jpeg", "jpg", "gif"],
        folderName = ""
    ) => {

    return new Promise( (resolve, reject) => {
        // deestructuramos para obtener el archivo
        const { file } = files;

        // validar la extensión del archivo
        const splittedName = file.name.split(".");
        const fileExtension = splittedName[ splittedName.length - 1 ];

        if ( !validExtensions.includes( fileExtension ) ) {
            return reject(`La extensión [${fileExtension}] no es permitida por este servicio. Extensiones permitidas: [${validExtensions}]`);
        }

        // renombramos el archivo
        const tempName = `${ uuidv4() }.${ fileExtension }`;    
        const uploadPath = path.join( __dirname, "../uploads/", folderName, tempName );
        file.mv( uploadPath, err => {
            if (err) {
                reject(err);
            }
            resolve( tempName );
        } );
    } );
}


module.exports = {
    uploadFile
}