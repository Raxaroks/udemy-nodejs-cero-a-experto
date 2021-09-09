const { response, request } = require("express");
const { Category } = require("../models");

// obtener las categorías desde una base de datos
const getCategories = async (req = request, res = response) => {
    const { limit = 5, since = 0} = req.query;
    const query = {
        status: true
    };

    const [ total, categories ] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .populate( "user", "username" )
            .skip( Number(since) )
            .limit( Number(limit) )
    ]);

    res.json({
        total,
        categories
    });
}

// obtener una categoría
const getCategory = async (req = request, res = response) => {
    const { id } = req.params;
    const category = await Category.findById(id).populate("user", "username");
    return res.json(category);
}

// crear una categoría en la base de datos
const createCategory = async (req = request, res = response) => {
    const name = req.body.name.toUpperCase();
    const dbCategory = await Category.findOne({ name });

    // if there is a category with the same name
    if (dbCategory) {
        return res.status(400).json({
            msg: `La categoría [${dbCategory.name}] ya existe.`
        });
    }

    // generate the data to save
    const data = {
        name,
        user: req.user._id
    };

    const category = new Category(data);

    // save it on the database
    await category.save();

    res.status(201).json( category );
}  

// actualizar los datos de una categoría
const updateCategory = async (req = request, res = response) => {
    const { id } = req.params;
    const { status, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate( id, data, { new: true } );

    res.json( category );
}

// eliminar una categoría
const deleteCategory = async (req = request, res = response) => {
    const { id } = req.params;
    const categoryDeleted = await Category.findByIdAndUpdate( id, { status: false }, { new: true } );
    res.json(categoryDeleted);
}



module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
};