import mongoose from "mongoose";

const inventarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true },
  categoria: { type: String },
  fechaCreacion: { type: Date, default: Date.now }
});

const Inventario = mongoose.model("Inventario", inventarioSchema);
export default Inventario;