import { DataTypes } from "sequelize"; 
import { sequelize } from "../db/db.js";

export const Perfil = sequelize.define("Perfil",{
    id:{type:
        DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {type:
        DataTypes.INTEGER,
        allowNull: false
    }
})