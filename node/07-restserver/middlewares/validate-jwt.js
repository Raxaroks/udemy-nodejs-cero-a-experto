const { response, request } = require("express")
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const validateJWT = async ( req = request, res = response, next ) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({
            msg: "Token inválido o inexistente."
        });
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        // get user from id
        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                msg: "Token inválido. El usuario no existe en la base de datos."
            })
        }

        // verify if the uid from the requester is active
        if ( !user.status ) {
            return res.status(401).json({
                msg: "Token inválido. Usuario inactivo. Sin permisos"
            })
        }

        req.user = user;
    } 
    catch (error) {
        console.log( error );
        res.status(401).json({
            msg: "Token inválido."
        });
    }

    next();
}


module.exports = {
    validateJWT
}