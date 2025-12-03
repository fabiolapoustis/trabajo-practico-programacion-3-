import bcrypt from "bcryptjs";
import express from "express";
import { sequelize } from "./ORM/db/conexiondb.js";
import session from "express-session";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

// Modelos
import { Usuario } from "./ORM/modelos/index.js";
import { Producto } from "./ORM/modelos/producto.js";
import { Venta } from "./ORM/modelos/venta.js";
import { Venta_detalle } from "./ORM/modelos/venta_detalle.js";

// Rutas API
import usuarioRuta from "./ORM/rutas/usuario.js";
import ventaRuta from "./ORM/rutas/venta.js";
import productoRuta from "./ORM/rutas/producto.js";

// Rutas Admin (EJS)
import adminRuta from "./ORM/rutas/admin.js";

const app = express();
const PORT = 3000;

// Obtener __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "vistas"));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "tu_secreto_super_seguro_cambialo",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 86400000 },
  })
);

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configuración Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
export const upload = multer({ storage });

// Rutas del sitio público
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/productos.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "productos.html"));
});

// Rutas API
app.use("/api/usuarios", usuarioRuta);
app.use("/api/ventas", ventaRuta);
app.use("/api/productos", productoRuta);

// Rutas Admin
app.use("/admin", adminRuta);

// Seeds
const initDDBB = async () => {
  console.log("🔄 Cargando seeds...");

  await Usuario.findOrCreate({
    where: { email: "admin@tienda.com" },
    defaults: {
      nombre: "Administrador",
      pass: await bcrypt.hash("admin123", 10),
    },
  });

  await Producto.findOrCreate({
    where: { nombre: "Peine" },
    defaults: {
      precio: "1200",
      descripcion: "Como peina este peine",
      imagen: "",
      categoria: "Gato",
      activo: true,
    },
  });

  console.log("✔ Seeds cargados");
};

// Inicializar servidor y DB
sequelize
  .sync({ force: false })
  .then(() => initDDBB())
  .then(() => {
    app.listen(PORT, () =>
      console.log("🚀 Servidor funcionando en http://localhost:" + PORT)
    );
  })
  .catch((error) => console.log("❌ Error:", error));
