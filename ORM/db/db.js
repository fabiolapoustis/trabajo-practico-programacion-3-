import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("trabajo_practico","root","",{
    host: "localhost",
    dialect: "mysql",
    port: 3306
})