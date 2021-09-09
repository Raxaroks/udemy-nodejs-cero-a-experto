
const { Role, User, Category, Product } = require("../models");

const isRoleValid = async (role = "") => {
    // check if role is valid
    const existsRole = await Role.findOne( { role } );
    if (!existsRole) {
        throw new Error(`El rol [${role}] no está registrado en la base de datos`);
    }
}

const emailExists = async (email = "") => {
    // check if mail if exists
    const exists = await User.findOne({ email });
    if (exists) {
        throw new Error(`El correo [${email}] ya está registrado`);
    }
}

const findIfUserExistsById = async (id = "") => {
    const exists = await User.findById(id);
    if (!exists) {
        throw new Error(`El ID [${id}] no existe`)
    }
}

const categoryExistsById = async (id = "") => {
    const exists = await Category.findById(id);
    if (!exists) {
        throw new Error(`El ID [${id}] no existe`)
    }
}

const productExistsById = async (id = "") => {
    const exists = await Product.findById(id);
    if (!exists) {
        throw new Error(`El ID [${id}] no existe`)
    }
}

const allowedCollections = async ( collection = "", collections = [] ) => {
    const isIncluded = collections.includes( collection );
    if( !isIncluded ) {
        throw new Error( `La colección [${collection}] no es permitida por este servicio. Extensiones permitidas: [${collections}]` );
    }
    return true;
}

module.exports = {
    isRoleValid,
    emailExists,
    findIfUserExistsById,
    categoryExistsById,
    productExistsById,
    allowedCollections
}

