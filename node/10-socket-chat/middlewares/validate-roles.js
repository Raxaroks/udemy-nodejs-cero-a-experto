const { request, response } = require("express");

const validateIsAdminRole = ( req = request, res = response, next ) => {
    if (!req.user) {
        return res.status(500).json({
            msg: "Se quiere verificar un rol con un token inválido."
        });
    }

    const { role, username } = req.user;

    if ( role !== "ADMIN_ROLE" ) {
        return res.status(401).json({
            msg: `El usuario [${username}] no tiene permisos para realizar esta operación.`
        })
    }

    next();
}

const hasRole = ( ...roles  ) => {
    return (req = request, res = response, next) => {
        if (!req.user) {
            return res.status(500).json({
                msg: "Se quiere verificar un rol con un token inválido."
            });
        }

        if (!roles.includes( req.user.role )) {
            return res.status(401).json({
                msg: `Para realizar esta petición, necesitas permisos de los siguientes roles: ${roles}`
            })
        }

        next();
    }
}


module.exports = { validateIsAdminRole, hasRole }