import mongoose from "mongoose";

const tareaSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente" },
  fechaVencimiento: String,
  estado: { type: String, default: "pendiente" }
});

export default mongoose.model("Tarea", tareaSchema);
