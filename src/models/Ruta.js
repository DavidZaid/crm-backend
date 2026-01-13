import mongoose from "mongoose";

const rutaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  cliente: { type: String },
  fecha: { type: String },
  estado: { type: String, default: 'pendiente' },
  fechaCreacion: { type: Date, default: Date.now }
});

const Ruta = mongoose.model("Ruta", rutaSchema);
export default Ruta;