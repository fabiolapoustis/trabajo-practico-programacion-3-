import { DataTypes } from "sequelize"; 
import { sequelize } from "../db/db.js";

export const Orden_venta = sequelize.define("Orden_venta",{
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
    estado:{type:
        DataTypes.STRING,
        allowNull: false
    }
})