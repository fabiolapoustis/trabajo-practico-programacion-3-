import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("pg","root","",{
    host: "localhost",
    dialect: "mysql",
    port: 3306
})