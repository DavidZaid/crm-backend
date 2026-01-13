import express from "express";
import {
  registrarVenta,
  obtenerVentas,
  obtenerVenta,
  actualizarVenta,
  eliminarVenta,
  cambiarEstado,

  // 👇 IMPORTAMOS TAMBIÉN LOS KPIs
  getTotalVentasMesActual,
  getVentasPorMes,
  getProductosMasVendidos
} from "../controllers/ventaController.js";

const router = express.Router();

// ============================
// CRUD NORMAL DE VENTAS
// ============================

// Obtener todas las ventas
router.get("/", obtenerVentas);

// Registrar venta
router.post("/", registrarVenta);

// Obtener venta por ID
router.get("/:id", obtenerVenta);

// Actualizar venta
router.put("/:id", actualizarVenta);

// Cambiar SOLO el estado
router.put("/estado/:id", cambiarEstado);

// Eliminar venta
router.delete("/:id", eliminarVenta);


// ============================
// RUTAS PARA REPORTES / KPIs
// ============================

// Total del mes actual
router.get("/kpi/total-mes", getTotalVentasMesActual);

// Ventas por mes del año
router.get("/kpi/ventas-por-mes", getVentasPorMes);

// Top productos más vendidos
router.get("/kpi/productos-top", getProductosMasVendidos);


export default router;
