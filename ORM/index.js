import express from "express";
import { sequelize } from "./db/db.js";

//modelos

import { Usuario } from "./modelos/index.js";
import { Producto } from "./modelos/producto.js";
import { Venta } from "./modelos/venta.js";
import { Orden_venta } from "./modelos/orden_venta.js";


//rutas

import cors from "cors";
import ususarioRuta from "./rutas/usuario.js";

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

const initDDBB = async () => {
  await Usuario.create({
    nombre: "Rolito",
    pass: "jijo123",
    email: "rolo_K-PO@hotmail.com"
  });

  await Usuario.create({
    nombre: "Farruco",
    pass: "iatusave",
    email: "farro_olivera@live.com"
  });

  await Producto.create({
    nombre: "Peine",
    precio: "1200",
    descripcion: "Como peina este peine",
    imagen: "",
    categoria: "Gato",
    estado: "activo"
  });

  await Producto.create({
    nombre: "Rasuradora",
    precio: "3000",
    descripcion: "Te rasuro el papo",
    imagen: "",
    categoria: "Perro",
    estado: "activo"
  });

  await Producto.create({
    nombre: "Torerita",
    precio: "800",
    descripcion: "Torerita beige con voladitos",
    imagen: "",
    categoria: "Gato",
    estado: "activo"
  });
}

//Definicion rutas

app.use("/usuario", ususarioRuta);

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Inicializamos la base de datos");
  })
  .then(()=> {
    initDDBB()
    console.log("Carga DDBB")
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("El servidor esta corriendo en el puerto " + PORT);
    });
  })
  .catch((error) => {
    console.log({ error });
  });