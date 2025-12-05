import { Venta } from "../modelos/venta.js";
import { Producto } from "../modelos/producto.js";
import { Venta_detalle } from "../modelos/venta_detalle.js";

export const crearVenta = async (req, res) => {
    try {
        const { nombre, productos } = req.body;

        if (!nombre || !productos || productos.length === 0) {
            return res.status(400).json({ 
                error: "Nombre y productos son obligatorios" 
            });
        }

        let total = 0;

        for (const item of productos) {
            const producto = await Producto.findByPk(item.id);
            if (!producto || !producto.activo) {
                return res.status(400).json({ 
                    error: `Producto con id ${item.id} no disponible` 
                });
            }
            total += producto.precio * item.cantidad;
        }

        const venta = await Venta.create({
            nombre,
            fecha: new Date(),
            total
        });

        for (const item of productos) {
            const producto = await Producto.findByPk(item.id);
            await Venta_detalle.create({
                ventaId: venta.id,
                productoId: producto.id,
                cantidad: item.cantidad,
                subtotal: producto.precio * item.cantidad
            });
        }

        const ventaCompleta = await Venta.findByPk(venta.id, {
            include: [{
                model: Producto,
                through: { attributes: ['cantidad', 'subtotal'] }
            }]
        });

        res.status(201).json({
            mensaje: "Venta registrada exitosamente",
            venta: ventaCompleta
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getVentas = async (req, res) => {
    try {
        const ventas = await Venta.findAll({
            include: [{
                model: Producto,
                through: { attributes: ['cantidad', 'subtotal'] }
            }],
            order: [['fecha', 'DESC']]
        });

        res.json(ventas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};