import { Router } from "express";
import { 
  mostrarLogin, 
  procesarLogin, 
  mostrarDashboard,
  mostrarProductos,
  mostrarFormularioCrear,
  mostrarFormularioEditar,
  crearProductoHTML,
  editarProductoHTML,
  desactivarProductoHTML,
  activarProductoHTML,
  mostrarVentas,
  mostrarUsuarios,
  logout 
} from "../controladores/admin.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

const verificarAuth = (req, res, next) => {
  if (!req.session.usuario) {
    return res.redirect('/login');
  }
  next();
};

// --- RUTAS LOGIN ---
router.get("/login", mostrarLogin);
router.post("/login", procesarLogin);
router.get("/logout", logout);

// --- RUTAS DASHBOARD ---
router.get("/dashboard", verificarAuth, mostrarDashboard);

// --- RUTAS PRODUCTOS ---
router.get("/productos", verificarAuth, mostrarProductos);
router.get("/productos/crear", verificarAuth, mostrarFormularioCrear);
router.post("/productos/crear", verificarAuth, upload.single('imagen'), crearProductoHTML);
router.get("/productos/editar/:id", verificarAuth, mostrarFormularioEditar);
router.post("/productos/editar/:id", verificarAuth, upload.single('imagen'), editarProductoHTML);
router.post("/productos/desactivar/:id", verificarAuth, desactivarProductoHTML);
router.post("/productos/activar/:id", verificarAuth, activarProductoHTML);

// --- RUTAS VENTAS ---
router.get("/ventas", verificarAuth, mostrarVentas);

// --- RUTAS USUARIOS ---
router.get("/usuarios", verificarAuth, mostrarUsuarios);

export default router;
