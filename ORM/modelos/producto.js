import { DataTypes } from "sequelize"; 
import { sequelize } from "../db/conexiondb.js";


async function iniciarBD() {
    try {
        await sequelize.authenticate();
        console.log("Conectado correctamente a MySQL ✔");

        await sequelize.sync({ force: false }); // NO borra la DB
        console.log("Modelos sincronizados ✔");
        
    } catch (error) {
        console.error("❌ Error al conectar/sincronizar DB:", error.message);
    }
}

iniciarBD();


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