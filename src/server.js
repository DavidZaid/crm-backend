import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Aquí es donde agregué tu link de Vercel para darte permiso de acceso
app.use(cors({
  origin: [
    "http://localhost:4200", 
    "http://127.0.0.1:4200",
    "https://crm-frontend-peach-psi.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

connectDB();

import clienteRoutes from "./routes/clienteRoutes.js";
import inventarioRoutes from "./routes/inventarioRoutes.js";
import rutaRoutes from "./routes/rutaRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import ventaRoutes from "./routes/ventaRoutes.js";

app.use("/api/clientes", clienteRoutes);
app.use("/api/inventario", inventarioRoutes);
app.use("/api/rutas", rutaRoutes);
app.use("/api/tareas", tareaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/ventas", ventaRoutes);

/* Servir Angular
const distPath = path.join(__dirname, "../crm-frontend/dist/crm-frontend");
app.use(express.static(distPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});
*/

app.get("/", (req, res) => {
  res.send("🚀 API de CRM funcionando correctamente");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});