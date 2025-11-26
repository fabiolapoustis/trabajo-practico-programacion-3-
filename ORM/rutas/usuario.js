import { Router } from "express";
import { getUsuario, crearUsuario } from "../controladores/usuario.js";

const router = Router();

router.get("/", getUsuario);
router.post("/", crearUsuario);

export default router;