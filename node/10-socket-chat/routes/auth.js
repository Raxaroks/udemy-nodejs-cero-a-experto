// default / necessary imports
const { Router } = require("express");
const { check } = require("express-validator"); 
// importing controllers
const { login, googleSignIn, refreshToken } = require("../controllers/auth");
// importing middlewares
const { validateFields, validateJWT } = require("../middlewares/");


// inicializamos un router
const router = Router();


// ruta para iniciar sesión por medio de un email
router.post( "/login", [
    check( "email", "El correo es obligatorio." ).isEmail(),
    check( "password", "La contraseña es obligatoria." ).not().isEmpty(),
    validateFields
], login );

// ruta para iniciar sesión por medio de Google
router.post( "/google", [
    check( "id_token", "El token es necesario." ).not().isEmpty(),
    validateFields
], googleSignIn );

// ruta para verificar y refrescar el token
router.get( "/", validateJWT, refreshToken );



module.exports = router;