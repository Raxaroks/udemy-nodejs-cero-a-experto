const fs = require("fs");
const path = require("path");
const { request, response } = require("express");
const { uploadFile } = require("../helpers/upload-file");
const { User, Product } = require("../models");

const cloudinary = require("cloudinary").v2;
cloudinary.config( process.env.CLOUDINARY_URL )


const loadFile = async (req = request, res = response) => {
    try {
        // solo imágenes
        const fileName = await uploadFile( req.files, undefined, "images" );

        // solo textos/md
        // const fileName = await uploadFile( req.files, ["txt", "md"], "texts" );
        res.json({ file_name: fileName });
    } 
    catch (errorMsg) {
        res.status(400).json({ errorMsg });
    }
};

const updateFileImage = async ( req = request, res = response ) => {
    const { id, collection } = req.params;

    let model;
    switch ( collection ) {
        case "users":
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe ningún usuario con este ID [${id}]`
                });
            }
            break;

        case "products":
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe ningún producto con este ID [${id}]`
                });
            }
            break;

        default:
            return res.status(500).json({
                msg: "No hay ningún tipo de validación implementada para este caso. Contactar al equipo de desarrollo."
            });
    }

    // limpiar archivos previos
    if (model.img) {
        // hay que borrar el archivo del server
        const pathFile = path.join( __dirname, "../uploads", collection, model.img );
        if ( fs.existsSync( pathFile ) ) {
            fs.unlinkSync(pathFile);
        }
    }

    const itemName = await uploadFile( req.files, undefined, collection );
    model.img = itemName;

    await model.save();
    res.json(model);
}

const updateFileImageCloudinary = async ( req = request, res = response ) => {
    const { id, collection } = req.params;

    let model;
    switch ( collection ) {
        case "users":
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe ningún usuario con este ID [${id}]`
                });
            }
            break;

        case "products":
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe ningún producto con este ID [${id}]`
                });
            }
            break;

        default:
            return res.status(500).json({
                msg: "No hay ningún tipo de validación implementada para este caso. Contactar al equipo de desarrollo."
            });
    }

    // limpiar archivos previos
    if (model.img) {
        const nameArr = model.img.split("/");
        const name = nameArr[ nameArr.length - 1 ];
        const [ public_id ] = name.split(".");
        await cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    model.img = secure_url;
    await model.save();

    res.json( model );

}

const showImage = async (req = request, res = response) => {
    const { id, collection } = req.params;

    let model;
    switch ( collection ) {
        case "users":
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe ningún usuario con este ID [${id}]`
                });
            }
            break;

        case "products":
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe ningún producto con este ID [${id}]`
                });
            }
            break;

        default:
            return res.status(500).json({
                msg: "No hay ningún tipo de validación implementada para este caso. Contactar al equipo de desarrollo."
            });
    }

    // limpiar archivos previos
    if (model.img) {
        // hay que borrar el archivo del server
        const pathFile = path.join( __dirname, "../uploads", collection, model.img );
        if ( fs.existsSync( pathFile ) ) {
            return res.sendFile( pathFile );
        }
    }

    const pathImage = path.join( __dirname, "../assets/no-image.jpg" );
    res.sendFile(pathImage)
}

module.exports = {
	loadFile,
    updateFileImage,
    showImage,
    updateFileImageCloudinary
};
