import express from "express";
import {
  crearRuta,
  obtenerRutas,
  obtenerRuta,
  actualizarRuta,
  eliminarRuta
} from "../controllers/rutaController.js";

const router = express.Router();

router.get("/", obtenerRutas);
router.post("/", crearRuta);
router.get("/:id", obtenerRuta);
router.put("/:id", actualizarRuta);
router.delete("/:id", eliminarRuta);

export default router;