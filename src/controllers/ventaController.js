import Venta from "../models/Venta.js";
import Inventario from "../models/Inventario.js";

/* ============================================================
   REGISTRAR VENTA CON CONTROL DE STOCK (NUEVO)
============================================================ */

export const registrarVenta = async (req, res) => {
  try {
    const { cliente, items, estado } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "La venta debe incluir al menos un producto." });
    }

    // Verificar stock
    for (const item of items) {
      const producto = await Inventario.findById(item.productoId);

      if (!producto) {
        return res.status(404).json({ message: `Producto no encontrado: ${item.nombre}` });
      }

      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          message: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}`,
        });
      }
    }

    // Calcular total
    let totalVenta = 0;
    items.forEach(i => totalVenta += i.subtotal);

    const nuevaVenta = new Venta({
      cliente,
      items,
      total: totalVenta,
      estado,
      fecha: new Date()
    });

    await nuevaVenta.save();

    // Descontar stock
    for (const item of items) {
      await Inventario.findByIdAndUpdate(item.productoId, {
        $inc: { stock: -item.cantidad }
      });
    }

    res.status(201).json({
      message: "Venta registrada y stock actualizado",
      venta: nuevaVenta
    });

  } catch (error) {
    console.error("Error registrarVenta:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ============================================================
   CRUD
============================================================ */

export const obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.find();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerVenta = async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id);
    if (!venta) return res.status(404).json({ message: "Venta no encontrada" });
    res.json(venta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const actualizarVenta = async (req, res) => {
  try {
    const venta = await Venta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(venta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const eliminarVenta = async (req, res) => {
  try {
    await Venta.findByIdAndDelete(req.params.id);
    res.json({ message: "Venta eliminada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cambiarEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const venta = await Venta.findByIdAndUpdate(req.params.id, { estado }, { new: true });
    res.json(venta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ============================================================
   REPORTES
============================================================ */

export const getTotalVentasMesActual = async (req, res) => {
  try {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59, 999);

    const resultado = await Venta.aggregate([
      { $match: { fecha: { $gte: inicioMes, $lte: finMes } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    const total = resultado.length > 0 ? resultado[0].total : 0;

    res.json({ mes: hoy.getMonth() + 1, anio: hoy.getFullYear(), total });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVentasPorMes = async (req, res) => {
  try {
    const year = new Date().getFullYear();

    const datos = await Venta.aggregate([
      { $match: { fecha: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31) } } },
      { $group: { _id: { mes: { $month: "$fecha" } }, total: { $sum: "$total" } } },
      { $sort: { "_id.mes": 1 } }
    ]);

    const nombresMeses = [
      "Enero","Febrero","Marzo","Abril","Mayo","Junio",
      "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
    ];

    const labels = [];
    const data = [];

    for (let i = 1; i <= 12; i++) {
      labels.push(nombresMeses[i - 1]);
      const encontrado = datos.find(d => d._id.mes === i);
      data.push(encontrado ? encontrado.total : 0);
    }

    res.json({ year, labels, data });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductosMasVendidos = async (req, res) => {
  try {
    const limite = parseInt(req.query.limit) || 5;

    const datos = await Venta.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.nombre", totalCantidad: { $sum: "$items.cantidad" } } },
      { $sort: { totalCantidad: -1 } },
      { $limit: limite }
    ]);

    const labels = datos.map(d => d._id);
    const data = datos.map(d => d.totalCantidad);

    res.json({ labels, data });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
