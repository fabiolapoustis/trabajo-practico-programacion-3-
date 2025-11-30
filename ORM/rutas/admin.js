import { Router } from "express";
import { 
  mostrarLogin, 
  procesarLogin, 
  mostrarDashboard,
  mostrarProductos,
  mostrarVentas,
  mostrarUsuarios,
  logout 
} from "../controladores/admin.js";

const router = Router();

const verificarAuth = (req, res, next) => {
  if (!req.session.usuario) {
    return res.redirect('/admin/login');
  }
  next();
};

router.get("/login", mostrarLogin);
router.post("/login", procesarLogin);

router.get("/dashboard", verificarAuth, mostrarDashboard);
router.get("/productos", verificarAuth, mostrarProductos);
router.get("/ventas", verificarAuth, mostrarVentas);
router.get("/usuarios", verificarAuth, mostrarUsuarios);
router.get("/logout", logout);

export default router;