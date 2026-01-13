import Ruta from "../models/Ruta.js";

// Crear nueva ruta
export const crearRuta = async (req, res) => {
  try {
    const ruta = new Ruta(req.body);
    await ruta.save();
    res.status(201).json(ruta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las rutas
export const obtenerRutas = async (req, res) => {
  try {
    const rutas = await Ruta.find();
    res.json(rutas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una ruta por ID
export const obtenerRuta = async (req, res) => {
  try {
    const ruta = await Ruta.findById(req.params.id);
    if (!ruta) return res.status(404).json({ message: "Ruta no encontrada" });
    res.json(ruta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar ruta
export const actualizarRuta = async (req, res) => {
  try {
    const ruta = await Ruta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ruta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar ruta
export const eliminarRuta = async (req, res) => {
  try {
    await Ruta.findByIdAndDelete(req.params.id);
    res.json({ message: "Ruta eliminada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};