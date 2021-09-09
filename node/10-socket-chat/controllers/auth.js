const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async ( req = request, res = response ) => {
    const { email, password } = req.body;

    try {
        // check if email exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: `Error de correo o contraseña no válidos -> [${email}]`
            })
        } 

        // check if user is active
        if (!user.status) {
            return res.status(400).json({
                msg: `Error de correo o contraseña no válidos -> [status: ${user.status}]`
            })
        } 

        // check password
        const validPass = bcryptjs.compareSync( password, user.password );
        if (!validPass) {
            return res.status(400).json({
                msg: `Error de correo o contraseña no válidos -> [password]`
            });
        }

        // generate jwt
        const token = await generateJWT( user.id );

        res.json({
            msg: "Login ok",
            user,
            token
        });
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error del sistema. Trate de contactar al equipo de desarrollo."
        });
    }
}

const googleSignIn = async ( req = request, res = response ) => {
    const { id_token } = req.body;

    try {
        const { username, email, img } = await googleVerify( id_token );

        let user = await User.findOne({email});

        // if user isn't registered
        if( !user ) {
            const data = {
                username,
                email,
                password: "asdf",
                img,
                google: true
            };
            user = new User(data);
            await User.save();
        }

        // if the user is invalid or is disabled
        if (!user.status) {
            return res.status(401).json({
                msg: "Usuario desactivado. Hable con el equipo de desarrollo."
            });
        }

        // generate JWT
        const token = await generateJWT( user.id );

        res.json({
            user, 
            token
        });
    } 
    
    catch (error) {
        res.status(400).json({
            msg: "El token de Google no es válido."
        })
    }
}

const refreshToken = async ( req = request, res = response ) => {
    const { user } = req;

    // gen JWT
    const token = await generateJWT( user.id );

    res.json({
        user,
        token
    });
    
}


module.exports = {
    login,
    googleSignIn,
    refreshToken
}