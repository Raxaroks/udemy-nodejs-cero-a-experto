
const { Router } = require("express");
const { check } = require("express-validator");
const { getUser, putUser, postUser, deleteUser, patchUser } = require("../controllers/user");

// custom middlewares
const { validateFields, validateJWT, validateIsAdminRole, hasRole } = require("../middlewares");
const { isRoleValid, emailExists, findIfUserExistsById } = require("../helpers/db-validators");


const router = Router();

router.get( "/", getUser );

router.put( "/:id", [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(findIfUserExistsById),
    check("role").custom( isRoleValid ),
    validateFields
], putUser );

router.post( "/", [ 
    check("username", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe de ser mayor a 5 caracteres").isLength({ min: 5 }),
    check("email", "El correo no es válido").isEmail(), 
    check("email").custom( emailExists ),
    check("role").custom( isRoleValid ),
    validateFields
], postUser );

router.delete( "/:id", [
    validateJWT,
    hasRole("ADMIN_ROLE", "SALES_ROLE"),
    // validateIsAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(findIfUserExistsById),
    validateFields
], deleteUser );

router.patch( "/", patchUser );


module.exports = router;