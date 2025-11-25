import { DataTypes } from "sequelize"; 
import { sequelize } from "../db/db.js";

export const Producto = sequelize.define("Producto",{
    id:{type:
        DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre:{type:
        DataTypes.STRING,
        allowNull: false
    },
    precio:{type:
        DataTypes.DOUBLE,
    },
    descripcion:{type:
        DataTypes.STRING
    },
    imagen:{type:
        DataTypes.STRING
    },
    categoria:{type:
        DataTypes.STRING
    },
    activo:{type:
        DataTypes.BOOLEAN
    }
})