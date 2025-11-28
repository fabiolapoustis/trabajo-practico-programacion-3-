import { Router } from "express";
import { crearVenta, getVentas } from "../controladores/venta.js";

const router = Router();

router.post("/", crearVenta);
router.get("/", getVentas);

export default router;