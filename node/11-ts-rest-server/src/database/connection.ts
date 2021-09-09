import { Sequelize } from "sequelize";


const Database = {
    name: process.env.DB_NAME || "",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASS || "",
}

const db = new Sequelize( Database.name, Database.user, Database.password, {
    host: "localhost",
    dialect: "mysql",
    // logging: false
} );


export default db;