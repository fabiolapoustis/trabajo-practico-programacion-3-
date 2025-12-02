import bcrypt from "bcrypt";

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
  try {
    console.log("🔄 Iniciando carga de seeds...");

    // Usuario 1
    const [usuario1, creado1] = await Usuario.findOrCreate({
      where: { email: "rolo_K-PO@hotmail.com" },
      defaults: {
        nombre: "Rolito",
        pass: "jijo123",
        email: "rolo_K-PO@hotmail.com"
      }
    });

    console.log(`Usuario 1 - Creado: ${creado1}, Pass en DB: ${usuario1.pass.substring(0, 30)}...`);

    // Si el usuario ya existía con pass sin encriptar, actualizarlo
    if (!creado1 && !usuario1.pass.startsWith("$2")) {
      console.log("⚠️ Usuario encontrado con pass sin encriptar, actualizando...");
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash("jijo123", salt);
      await Usuario.update({ pass: hashedPass }, { 
        where: { id: usuario1.id },
        hooks: false 
      });
      console.log("✅ Pass actualizado correctamente");
    }

    // Usuario 2
    const [usuario2, creado2] = await Usuario.findOrCreate({
      where: { email: "farro_olivera@live.com" },
      defaults: {
        nombre: "Farruco",
        pass: "iatusave",
        email: "farro_olivera@live.com"
      }
    });

    if (!creado2 && !usuario2.pass.startsWith("$2")) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash("iatusave", salt);
      await Usuario.update({ pass: hashedPass }, { 
        where: { id: usuario2.id },
        hooks: false 
      });
    }

    // ...resto de productos...
    await Producto.findOrCreate({
      where: { nombre: "Peine" },
      defaults: {
        nombre: "Peine",
        precio: "1200",
        descripcion: "Como peina este peine",
        imagen: "",
        categoria: "Gato",
        activo: true
      }
    });

    await Producto.findOrCreate({
      where: { nombre: "Rasuradora" },
      defaults: {
        nombre: "Rasuradora",
        precio: "3000",
        descripcion: "Te rasuro el papo",
        imagen: "",
        categoria: "Perro",
        activo: true
      }
    });

    await Producto.findOrCreate({
      where: { nombre: "Torerita" },
      defaults: {
        nombre: "Torerita",
        precio: "800",
        descripcion: "Torerita beige con voladitos",
        imagen: "",
        categoria: "Gato",
        activo: false
      }
    });

    console.log("✅ Seeds cargados correctamente");

  } catch (error) {
    console.error("❌ Error al cargar seeds:", error.message);
  }
};

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
    return initDDBB();
  })
  .then(() => {
    console.log("Carga DDBB");
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("El servidor esta corriendo en el puerto " + PORT);
    });
  })
  .catch((error) => {
    console.log({ error });
  });