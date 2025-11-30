import { DataTypes } from "sequelize"; 
import { sequelize } from "../db/db.js";

export const Venta_detalle = sequelize.define('Venta_detalle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DOUBLE,
    allowNull: false
  }
});