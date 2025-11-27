import { Router } from "express";
import { getProducto,
    getProductoPorId,
    crearProducto,
    modificarProducto,
    desactivarProducto,
    activarProducto,
    getProductosActivos } from "../controladores/producto.js";

const router = Router();

// Rutas públicas (para el cliente)
router.get("/activos", getProductosActivos); // Debe ir ANTES de "/:id"

// Rutas generales
router.get("/", getProducto); // Listar todos (con filtros y paginación)
router.get("/:id", getProductoPorId); // Obtener uno por ID

// Rutas de administración
router.post("/", crearProducto); // Crear
router.put("/:id", modificarProducto); // Modificar
router.delete("/:id", desactivarProducto); // Desactivar (baja lógica)
router.put("/:id/activar", activarProducto); // Activar

export default router;