const { Router, request, response } = require("express");
const { check } = require("express-validator"); 
const { getProduct, getProducts, createProduct, updateProduct, deleteProduct } = require("../controllers/products");
const { productExistsById, categoryExistsById } = require("../helpers/db-validators");
const { validateJWT, validateFields, validateIsAdminRole } = require("../middlewares");


const router = Router();

// ruta para obtener todos los productos
router.get( "/", getProducts );

// ruta para obtener un producto
router.get( "/:id", [
    check( "id", "No es un ID de Mongo válido" ).isMongoId(),
    check("id").custom( productExistsById ),
    validateFields
], getProduct );

// ruta para crear un producto
router.post( "/", [
    validateJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("price", "El precio debe de ser un número").isNumeric(),
    check("category", "El ID de la categoría es obligatoria").not().isEmpty(),
    check("category", "No es un ID de Mongo válido").isMongoId(),
    check("category").custom( categoryExistsById ),
    validateFields
], createProduct );

// ruta para modificar un producto
router.put( "/:id", [
    validateJWT,
    validateIsAdminRole,
    check( "id", "No es un ID de Mongo válido" ).isMongoId(),
    check("id").custom( productExistsById ),   
    validateFields
], updateProduct );

// ruta para eliminar un producto
router.delete( "/:id", [
    validateJWT,
    validateIsAdminRole,
    check( "id", "No es un ID de Mongo válido" ).isMongoId(),
    check("id").custom( productExistsById ),   
    validateFields
], deleteProduct );


module.exports = router;