import { validate as uuidValidate  } from "uuid";

const validID = ( id: string ) => {
    if ( !uuidValidate(id) ) {
        throw new Error( `The ID [${ id }] format is not valid` );
    }
    return true;
}

export default validID;