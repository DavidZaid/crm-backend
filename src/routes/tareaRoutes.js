import express from "express";
import Tarea from "../models/Tarea.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const tareas = await Tarea.find().populate("cliente");
  res.json(tareas);
});

router.post("/", async (req, res) => {
  const nueva = new Tarea(req.body);
  await nueva.save();
  res.json(nueva);
});

router.put("/:id", async (req, res) => {
  const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(tarea);
});

router.put("/completar/:id", async (req, res) => {
  const tarea = await Tarea.findByIdAndUpdate(req.params.id, { estado: "completada" }, { new: true });
  res.json(tarea);
});

router.delete("/:id", async (req, res) => {
  await Tarea.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Tarea eliminada" });
});

export default router;
