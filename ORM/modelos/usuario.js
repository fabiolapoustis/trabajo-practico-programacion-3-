import { DataTypes } from "sequelize"; 
import { sequelize } from "../db/db.js";

export const Usuario = sequelize.define("usuario",{
    id:{type:
        DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre:{type:
        DataTypes.STRING,
        allowNull: false
    },
    pass:{type:
        DataTypes.STRING,
        allowNull: false
    },
    email:{type:
        DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

