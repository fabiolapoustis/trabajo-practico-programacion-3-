import { Router } from "express";
import { getUsuario } from "../controladores/usuario.js";

const router = Router();

router.get("/", getUsuario);

export default router;