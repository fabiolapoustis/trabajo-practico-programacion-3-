/*import { DataTypes } from "sequelize"; 
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
    
    beforeCreate: async (usuario) => {
        const salt = await bcrypt.genSalt(10);
        usuario.pass = await bcrypt.hash(usuario.pass, salt);
    },
    beforeUpdate: async (usuario) => {
        if (usuario.changed('pass')) {
            const salt = await bcrypt.genSalt(10);
            usuario.pass = await bcrypt.hash(usuario.pass, salt);
        }
    }
});

Usuario.prototype.compararPassword = async function(passIngresado) {
    return await bcrypt.compare(passIngresado, this.pass);
};*/

import { DataTypes } from "sequelize";
// ...existing code...
import { sequelize } from "../db/db.js";
import bcrypt from "bcrypt";

export const Usuario = sequelize.define("usuario", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pass: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  hooks: {
    beforeCreate: async (usuario) => {
      console.log('🔐 beforeCreate - Pass ANTES:', usuario.pass);
      const salt = await bcrypt.genSalt(10);
      usuario.pass = await bcrypt.hash(usuario.pass, salt);
      console.log('🔐 beforeCreate - Pass DESPUÉS:', usuario.pass);
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('pass')) {
        console.log('🔐 beforeUpdate - Pass ANTES:', usuario.pass);
        const salt = await bcrypt.genSalt(10);
        usuario.pass = await bcrypt.hash(usuario.pass, salt);
        console.log('🔐 beforeUpdate - Pass DESPUÉS:', usuario.pass);
      }
    }
  }
});

Usuario.prototype.compararPassword = async function(passIngresado) {
  try {
    return await bcrypt.compare(passIngresado, this.pass);
  } catch (err) {
    console.error('Error compararPassword:', err);
    return false;
  }
};