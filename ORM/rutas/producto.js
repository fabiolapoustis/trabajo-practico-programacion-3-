import { Router } from "express";
import { getProducto } from "../controladores/producto.js";

const router = Router();

router.get("/", getProducto);

export default router;