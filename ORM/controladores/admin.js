import { Usuario } from "../modelos/index.js";
import { Producto } from "../modelos/producto.js";
import { Venta } from "../modelos/venta.js";

export const mostrarLogin = async (req, res) => {
  try {
    if (req.session.usuario) {
      return res.redirect('/admin/dashboard');
    }
    res.render('admin/login', { 
      titulo: 'login',
      error: null 
    });
  } catch (error) {
    res.status(500).render('admin/login', { 
      titulo: 'login',
      error: 'Error' 
    });
  }
};

export const mostrarDashboard = async (req, res) => {
  try {

    const totalProductos = await Producto.count();
    const productosActivos = await Producto.count({ where: { activo: true } });
    const productosInactivos = await Producto.count({ where: { activo: false } });
    const totalVentas = await Venta.count();
    const totalUsuarios = await Usuario.count();


    const ventas = await Venta.findAll();
    const ingresosTotales = ventas.reduce((sum, venta) => sum + venta.total, 0);

    res.render('admin/dashboard', {
      titulo: 'dashboard',
      usuario: req.session.usuario,
      estadisticas: {
        totalProductos,
        productosActivos,
        productosInactivos,
        totalVentas,
        totalUsuarios,
        ingresosTotales
      }
    });
  } catch (error) {
    console.error('Error en dashboard:', error);
    res.status(500).send('Error al cargar el dashboard');
  }
};

export const mostrarProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      order: [['id', 'ASC']]
    });

    res.render('admin/productos', {
      titulo: 'productos',
      usuario: req.session.usuario,
      productos
    });
  } catch (error) {
    console.error('Error al cargar productos:', error);
    res.status(500).send('Error al cargar productos');
  }
};

export const mostrarVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: [{
        model: Producto,
        through: { attributes: ['cantidad', 'subtotal'] }
      }],
      order: [['fecha', 'DESC']]
    });

    res.render('admin/ventas', {
      titulo: 'ventas',
      usuario: req.session.usuario,
      ventas
    });
  } catch (error) {
    console.error('Error al cargar ventas:', error);
    res.status(500).send('Error al cargar ventas');
  }
};