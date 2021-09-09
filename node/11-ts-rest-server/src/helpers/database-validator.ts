import User from "../models/user";


export const emailExistsInDB = async ( email: string = "" ) => {
    const exists = await User.findOne( { where: { email } } );
    if (exists) {
        throw new Error( `The email [${ email }] is already on our database` );
    }
}

export const userExistsInDB = async ( id: string ) => {
    const user = await User.findByPk( id );
    if ( !user ) {
        throw new Error( `There isn't any user in the database with that id [${ id }]`, );
    }
}