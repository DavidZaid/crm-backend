import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String },
  direccion: { type: String },
  empresa: { type: String },
  fechaRegistro: { type: Date, default: Date.now }
});

const Cliente = mongoose.model("Cliente", clienteSchema);
export default Cliente;
