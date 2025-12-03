import { DataTypes } from "sequelize"; 
import { sequelize } from "../db/conexiondb.js";

export const Venta = sequelize.define("Venta",{
    id:{type:
        DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre:{type:
        DataTypes.STRING,
        allowNull: false
    },
    fecha:{type:
        DataTypes.DATE,
        allowNull: false
    },
    total:{type:
        DataTypes.DOUBLE,
        allowNull: false
    }
})