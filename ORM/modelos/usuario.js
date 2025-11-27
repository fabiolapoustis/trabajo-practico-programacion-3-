import { DataTypes } from "sequelize"; 
import { sequelize } from "../db/db.js";
import bcrypt from "bcrypt";

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
}, {
    
    // Encriptar contraseña antes de crear el usuario
    beforeCreate: async (usuario) => {
        const salt = await bcrypt.genSalt(10);
        usuario.pass = await bcrypt.hash(usuario.pass, salt);
    },
    // Encriptar contraseña antes de actualizar el usuario
    beforeUpdate: async (usuario) => {
        if (usuario.changed('pass')) {
            const salt = await bcrypt.genSalt(10);
            usuario.pass = await bcrypt.hash(usuario.pass, salt);
        }
    }
});

// Método para comparar contraseñas
Usuario.prototype.compararPassword = async function(passIngresado) {
    return await bcrypt.compare(passIngresado, this.pass);
};
