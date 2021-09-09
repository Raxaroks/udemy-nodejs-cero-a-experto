
const { request, response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { User, Category, Product } = require("../models");


const allowedCollections = [
    "categories",
    "products",
    // "roles",
    "users",
];


// search for category name or ID
const searchCategories = async ( keyword = "", res = response ) => {
    const isMongoId = ObjectId.isValid(keyword);
    if ( isMongoId ) {
        const category = await Category.findById(keyword);
        res.json({
            results: (category) ? [category] : []
        });
    }

    const regex = new RegExp( keyword, "i" );
    const categories = await Category.find({ 
        name: regex, 
        status: true
    });

    return res.json({
        results: categories
    });
}

const searchProducts = async ( keyword = "", res = response ) => {
    const isMongoId = ObjectId.isValid(keyword);
    if ( isMongoId ) {
        const product = await Product.findById(keyword).populate( "category", "name" );
        res.json({
            results: (product) ? [product] : []
        });
    }

    const regex = new RegExp( keyword, "i" );
    const products = await Product.find({ 
        name: regex, 
        status: true
    }).populate( "category", "name" );

    return res.json({
        results: products
    });
}

// const searchRoles = async ( keyword = "", res = response ) => {}

// search for username, ID or email
const searchUsers = async ( keyword = "", res = response ) => {
    const isMongoId = ObjectId.isValid(keyword);
    if ( isMongoId ) {
        const user = await User.findById(keyword);
        res.json({
            results: (user) ? [user] : []
        });
    }

    const regex = new RegExp( keyword, "i" );
    const users = await User.find({
        $or: [ { username: regex }, { email: regex } ],
        $and: [ { status: true } ]
    });
    res.json({
        results: users
    });
}

const search = ( req = request, res = response ) => {
    const { collection, keyword } = req.params

    if ( !allowedCollections.includes(collection) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son las siguientes: [ ${ allowedCollections } ]`
        });
    }

    switch (collection) {
        case "categories":
            searchCategories( keyword, res )
            break;

        case "products":
            searchProducts( keyword, res )
            break;

        // case "roles":
        //     break;

        case "users":
            searchUsers( keyword, res );
            break;

        default:
            res.status(500).json({ msg: "Error al hacer la búsqueda..." });
            break;
    }
}



module.exports = {
    search
}