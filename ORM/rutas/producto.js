import { Router } from "express";
import { getProducto,
    getProductoPorId,
    crearProducto,
    modificarProducto,
    desactivarProducto,
    activarProducto,
    getProductosActivos } from "../controladores/producto.js";
import { validarProducto } from "../middlewares/validaciones.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

// Rutas públicas (para el cliente)
router.get("/activos", getProductosActivos);

// Rutas generales
router.get("/", getProducto); 
router.get("/:id", getProductoPorId); 

// Rutas de administración

router.post("/", upload.single('imagen'), validarProducto, crearProducto);
router.put("/:id", modificarProducto); 
router.delete("/:id", desactivarProducto); 
router.put("/:id/activar", activarProducto); 
router.post("/", upload.single('imagen'), crearProducto); 

//validaciones
router.post("/", validarProducto);
router.put("/:id", validarProducto, modificarProducto);

export default router;