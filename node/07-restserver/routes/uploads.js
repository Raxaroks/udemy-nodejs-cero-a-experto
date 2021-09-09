const { Router } = require("express");
const { check } = require("express-validator"); 
const { validateFields, validateUploadFile } = require("../middlewares");
const { loadFile, updateFileImage, showImage, updateFileImageCloudinary } = require("../controllers/uploads");
const { allowedCollections } = require("../helpers");


const router = Router();

router.post( "/", validateUploadFile, loadFile );

// router.put( "/:collection/:id", [
//     validateUploadFile,
//     check( "id", "No es un ID de Mongo válido" ).isMongoId(),
//     check( "collection" ).custom( c => allowedCollections( c, ["users", "products"] ) ),
//     validateFields
// ], updateFileImage );

router.put( "/:collection/:id", [
    validateUploadFile,
    check( "id", "No es un ID de Mongo válido" ).isMongoId(),
    check( "collection" ).custom( c => allowedCollections( c, ["users", "products"] ) ),
    validateFields
], updateFileImageCloudinary );

router.get( "/:collection/:id", [
    check( "id", "No es un ID de Mongo válido" ).isMongoId(),
    check( "collection" ).custom( c => allowedCollections( c, ["users", "products"] ) ),
    validateFields
], showImage );


module.exports = router;