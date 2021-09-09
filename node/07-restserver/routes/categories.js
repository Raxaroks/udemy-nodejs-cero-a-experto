const { Router } = require("express");
const { check } = require("express-validator"); 
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require("../controllers/categories");
const { categoryExistsById } = require("../helpers/db-validators");
const { validateJWT, validateFields, validateIsAdminRole } = require("../middlewares");


const router = Router();


// obtener todas las categorías (public)
router.get( "/", getCategories );

// obtener una categoría por ID (public)
router.get( "/:id", [
    check( "id", "No es un ID de Mongo válido" ).isMongoId(),
    check("id").custom( categoryExistsById ),
    validateFields,
], getCategory );

// crear una nueva categoría (private - cualquier persona con un token válido)
router.post( "/", [
    validateJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    validateFields
], createCategory );

// actualizar una categoría (private - cualquier persona con un token válido)
router.put( "/:id", [
    validateJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("id").custom( categoryExistsById ),
    validateFields
], updateCategory );

// eliminar una categoría (private - solamente un usuario con ADMIN_ROLE)
router.delete( "/:id", [
    validateJWT,
    validateIsAdminRole,
    check( "id", "No es un ID de Mongo válido" ).isMongoId(),
    check("id").custom( categoryExistsById ),   
    validateFields
], deleteCategory );


module.exports = router;