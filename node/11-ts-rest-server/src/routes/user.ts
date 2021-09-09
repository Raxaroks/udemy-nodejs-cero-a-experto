import { Router } from "express";
import { check } from "express-validator"

// importing middlewares and helpers
import validateRequest from "../middlewares/validate-request";
import { emailExistsInDB, userExistsInDB } from "../helpers/database-validator";

// importing controllers
import { getUsers, getUser, putUser, postUser, deleteUser } from "../controller/user";
import validID from "../helpers/uuid-validator";

// init router
const router = Router();

// declaring routes

// gets a list of the active users on the database
router.get( "/", getUsers );

// gets an user finded by an ID
router.get( "/:id", getUser );


// creates a new user on the database
router.post( "/", [
    check("name", "The name is required").not().isEmpty(),
    check("email", "The email is required").not().isEmpty(),
    check("email", "The email is not valid").isEmail(),
    check("password", "The password must contain up to 8 characters").isLength({ min: 8 }),
    check("email").custom(emailExistsInDB),
    validateRequest
], postUser );

// updates user's info on the database finded by its ID
router.put( "/:id", [
    check("id").custom(validID),
    check("id").custom(userExistsInDB),
    check("email").custom(emailExistsInDB),
    validateRequest
], putUser );

// deletes an user's finded by its ID
router.delete( "/:id", [
    check("id").custom(validID),
    check("id").custom(userExistsInDB),
    validateRequest
], deleteUser );


// exporting by default
export default router;