const express = require('express');

//import { Sequelize, DataTypes } from "sequelize";

const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const PORT = 3000;

const db_port= 3306

app.use(express.json());

//conexion bbdd

const sequelize = new Sequelize("PG","root","",{
    host: "localhost",
    dialect: "mysql",
    port: db_port,
})

module.exports = { sequelize, DataTypes};

//Crear tabla usuario

const Usuario = sequelize.define("Usuario", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
});

app.get("/", async (req, res) => {
    try{
        const users = await Usuario.findAll({});

        res.send(users);
    }catch(error){
        console.log({error})
    }
});

sequelize
  .sync({ force: true }) // force -> true/false   alter -> true/false
  .then(() => {
    console.log("Conectando a la data base");
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("El servidor esta corriendo en el puerto " + PORT);
    });
  })
  .catch((error) => console.log({ error }));