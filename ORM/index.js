import express from "express";
import { sequelize } from "./db/db.js";
import session from "express-session";

//cargaimagenes
import path from "path";
import { fileURLToPath } from 'url';

//modelos

import { Usuario } from "./modelos/index.js";
import { Producto } from "./modelos/producto.js";
import { Venta } from "./modelos/venta.js";
import { Venta_detalle } from "./modelos/venta_detalle.js";


//rutas

import cors from "cors";
import usuarioRuta from "./rutas/usuario.js";
import productoRuta from "./rutas/producto.js"
import ventaRuta from "./rutas/venta.js";

// Rutas Vistas HTML
import adminRuta from "./rutas/admin.js";

const app = express();
const PORT = 3000;

//cargaimagenes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//configuracion ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'vistas'));

//mdlw
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para formularios HTML

//Configuración de sesiones
app.use(session({
  secret: 'tu_secreto_super_seguro_cambialo', // Cambiar en producción
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Cambiar a true si usas HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 24 horas
  }
}));

// Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));

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
    activo: true
  });

  await Producto.create({
    nombre: "Rasuradora",
    precio: "3000",
    descripcion: "Te rasuro el papo",
    imagen: "",
    categoria: "Perro",
    activo: true
  });

  await Producto.create({
    nombre: "Torerita",
    precio: "800",
    descripcion: "Torerita beige con voladitos",
    imagen: "",
    categoria: "Gato",
    activo: false
  });

  /*await Venta.create({
    nombre: "Josesito",
    fecha: "12/10/2024",
    total: 7894651.5
  });

  await Venta.create({
    nombre: "Martuli",
    fecha: "25/09/2025",
    total: 2364
  })*/
}

//Definicion rutas

app.use("/usuario", usuarioRuta);
app.use("/producto", productoRuta);
app.use("/venta", ventaRuta);

// Rutas Admin (Vistas HTML con EJS)
app.use("/admin", adminRuta);

// Ruta raíz - Redirigir al login admin
app.get("/", (req, res) => {
  res.redirect("/admin/login");
});

//cargaimagenes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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