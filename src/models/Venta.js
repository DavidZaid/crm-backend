import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: "Inventario", required: true },
  nombre: { type: String, required: true },
  cantidad: { type: Number, required: true },
  precio: { type: Number, required: true },
  subtotal: { type: Number, required: true },
});

const ventaSchema = new mongoose.Schema({
  cliente: { type: String, required: true },

  items: {
    type: [itemSchema],
    required: true
  },

  total: { type: Number, required: true },

  estado: {
    type: String,
    enum: ["prospecto", "negociacion", "cierre"],
    default: "prospecto"
  },

  fecha: { type: Date, default: Date.now }
});

const Venta = mongoose.model("Venta", ventaSchema);
export default Venta;
