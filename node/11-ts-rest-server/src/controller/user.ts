import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcryptjs from "bcryptjs";
import User from "../models/user";

// route to get all users from the database
export const getUsers = async ( req: Request, res: Response ) => {
    const users = await User.findAll();
    res.json({ users });
}

// route to get an user from the database
export const getUser = async ( req: Request, res: Response ) => {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (user) {
        res.json({user});
    }
    else {
        res.status(404).json({ msg: `There is no user with this ID [${ id }]` });
    }
}

// route to post an user into the database
export const postUser = async ( req: Request, res: Response ) => {
    const { body } = req;
    try {
        const user = User.build(body);
        
        // generate uuid
        const id = uuidv4();
        user.set( "id", id );

        // encrypt password
        const salt = bcryptjs.genSaltSync();
        user.set( "password", bcryptjs.hashSync( user.getDataValue("password"), salt ) )

        // save in the database
        await user.save();

        // send response
        res.json({
            user
        })
    } 
    
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: {
                msg: "Internal Server Error. Please contact the development team."
            }
        })
    } 
}

// route to put an user into the database
export const putUser = async ( req: Request, res: Response ) => {
    const { id } = req.params;
    const { body } = req;
    try {
        // update user info
        const user = await User.findByPk(id);
        await user?.update(body);
        
        // send response
        res.json(user);
    } 
    
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: {
                msg: "Internal Server Error. Please contact the development team."
            }
        });
    } 
}

// route to delete an user from the database
export const deleteUser = async ( req: Request, res: Response ) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);

        // logical delete
        await user?.update({ status: false });

        // physical delete
        // await user?.destroy();

        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: {
                msg: "Internal Server Error. Please contact the development team."
            }
        });
    }
}
