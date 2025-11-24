import express from "express";
import { sequelize } from "./db/db.js";

import { Usuario } from "./modelos/usuario.js";
import { Producto } from "./modelos/producto.js";
import { Perfil } from "./modelos/perfil.js";
import { Venta } from "./modelos/venta.js";
import { Orden_venta } from "./modelos/orden_venta.js";

import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Inicializamos la base de datos");
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("El servidor esta corriendo en el puerto " + PORT);
    });
  })
  .catch((error) => {
    console.log({ error });
  });