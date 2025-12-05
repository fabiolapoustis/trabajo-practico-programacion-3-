import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("db", "root", "", {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    logging: false
});
