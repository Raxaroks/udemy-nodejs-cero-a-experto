const bcryptjs = require("bcryptjs");
const { response, request } = require("express");
const User = require( "../models/user" );

const getUser = async (req = request, res = response) => {
    const { limit = 5, since = 0 } = req.query;
    const query = { status: true };

    // solve all querys
    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip( Number(since) )
            .limit( Number(limit) )
    ]);

    res.json({
        total, 
        users
    });
}

const putUser = async (req, res = response) => {
    const { id } = req.params;
    const { password, google, ...rest } = req.body;

    if ( password ) {
        // encrypt password
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync( password, salt );
    }

    const user = await User.findByIdAndUpdate( id, rest );
 
    res.json(user);
}

const postUser = async (req, res = response) => {

    const { username, email, password, role } = req.body;
    const user = new User( { username, email, password, role } );

    // encrypt password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    // save in database
    await user.save();

    res.json({
        user
    });
}

const deleteUser = async (req, res = response) => {
    const { id } = req.params

    // delete from the collection 
    // const user = await User.findByIdAndDelete( id );

    // hide or deactivate user from the collection
    const user = await User.findByIdAndUpdate( id, { status: false } );
    const authUser = req.user;

    res.json({
        user,
        authUser
    });
}

const patchUser = (req, res = response) => {
    res.json({
        msg: "patch API - controller",
    });
}



module.exports = {
    getUser,
    putUser,
    postUser,
    deleteUser,
    patchUser,
}