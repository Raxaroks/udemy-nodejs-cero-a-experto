const { response, request } = require("express");
const { Product } = require("../models");

// ruta para obtener todos los productos
const getProducts = async ( req = request, res = response ) => {
    const { limit = 5, since = 0 } = req.query;
    const query = { status: true };

    const [ total, products ] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate( "product", "name" )
            .skip( Number(since) )
            .limit( Number(limit) )
    ]);

    res.json({
        total,
        products
    });
}

// ruta para obtener un producto
const getProduct = async ( req = request, res = response ) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    return res.json(product);
}

// ruta para crear un producto
const createProduct = async ( req = request, res = response ) => {
    const name = req.body.name.toUpperCase();
    const { price, category } = req.body;

    const dbProduct = await Product.findOne({ name });

    // if there is a product with the same name
    if (dbProduct) {
        return res.status(400).json({
            msg: `El producto [${dbProduct.name}] ya existe.`
        });
    }

    // generate the data to save
    const data = {
        name,
        price,
        category,
        user: req.user._id
    };

    const product = new Product(data);

    // save it on the database
    await product.save();

    res.status(201).json( product );
}

// ruta para modificar un producto
const updateProduct = async ( req = request, res = response ) => {
    const { id } = req.params;
    const { status, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate( id, data, { new: true } );

    res.json( product );
}

// ruta para eliminar un producto
const deleteProduct = async ( req = request, res = response ) => {
    const { id } = req.params;
    const productDeleted = await Product.findByIdAndUpdate( id, { status: false }, { new: true } );
    res.json(productDeleted);
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}