// src/controllers/tareaController.js
import Tarea from "../models/Tarea.js";

// Obtener todas las tareas (opcionalmente filtradas por estado o cliente)
export const obtenerTareas = async (req, res) => {
  try {
    const { estado, clienteId } = req.query;

    const filtros = {};
    if (estado) filtros.estado = estado;
    if (clienteId) filtros.cliente = clienteId;

    const tareas = await Tarea.find(filtros)
      .populate("cliente", "nombre email telefono")
      .sort({ fechaVencimiento: 1 });

    res.json(tareas);
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    res.status(500).json({ msg: "Error al obtener tareas" });
  }
};

// Obtener una tarea por ID
export const obtenerTarea = async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id).populate(
      "cliente",
      "nombre email telefono"
    );
    if (!tarea) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }
    res.json(tarea);
  } catch (error) {
    console.error("Error al obtener tarea:", error);
    res.status(500).json({ msg: "Error al obtener tarea" });
  }
};

// Crear nueva tarea
export const crearTarea = async (req, res) => {
  try {
    const { titulo, descripcion, cliente, fechaVencimiento, estado, prioridad, tipo } =
      req.body;

    const nuevaTarea = new Tarea({
      titulo,
      descripcion,
      cliente,
      fechaVencimiento,
      estado,
      prioridad,
      tipo,
    });

    const tareaGuardada = await nuevaTarea.save();
    const tareaConCliente = await Tarea.findById(tareaGuardada._id).populate(
      "cliente",
      "nombre email telefono"
    );

    res.status(201).json(tareaConCliente);
  } catch (error) {
    console.error("Error al crear tarea:", error);
    res.status(500).json({ msg: "Error al crear tarea" });
  }
};

// Actualizar tarea
export const actualizarTarea = async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    const campos = [
      "titulo",
      "descripcion",
      "cliente",
      "fechaVencimiento",
      "estado",
      "prioridad",
      "tipo",
    ];

    campos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        tarea[campo] = req.body[campo];
      }
    });

    const tareaActualizada = await tarea.save();
    const tareaConCliente = await Tarea.findById(tareaActualizada._id).populate(
      "cliente",
      "nombre email telefono"
    );

    res.json(tareaConCliente);
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    res.status(500).json({ msg: "Error al actualizar tarea" });
  }
};

// Eliminar tarea
export const eliminarTarea = async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    await tarea.deleteOne();
    res.json({ msg: "Tarea eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    res.status(500).json({ msg: "Error al eliminar tarea" });
  }
};

// Marcar como completada
export const completarTarea = async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    tarea.estado = "completada";
    const tareaActualizada = await tarea.save();
    res.json(tareaActualizada);
  } catch (error) {
    console.error("Error al completar tarea:", error);
    res.status(500).json({ msg: "Error al completar tarea" });
  }
};
