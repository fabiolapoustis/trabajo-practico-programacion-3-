import { Router } from "express";
import { getUsuario, crearUsuario, loginUsuario } from "../controladores/usuario.js";

const router = Router();

router.get("/", getUsuario);
router.post("/", crearUsuario);
router.post("/login", loginUsuario);

export default router;