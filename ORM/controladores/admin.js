import { Usuario } from "../modelos/index.js";
import { Producto } from "../modelos/producto.js";
import { Venta } from "../modelos/venta.js";

// LOGIN
export const mostrarLogin = async (req, res) => {
  try {
    if (req.session.usuario) return res.redirect('/dashboard');
    res.render('login', { titulo: 'Login Administrador', error: null });
  } catch (error) {
    res.status(500).render('login', { titulo: 'Login Administrador', error: 'Error al cargar la página' });
  }
};

export const procesarLogin = async (req, res) => {
  try {
    const { email, pass } = req.body;
    if (!email || !pass) return res.render('login', { titulo: 'Login Administrador', error: 'Email y contraseña son requeridos' });

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.render('login', { titulo: 'Login Administrador', error: 'Credenciales incorrectas' });

    const passwordValido = await usuario.compararPassword(pass);
    
    if (!passwordValido) return res.render('login', { titulo: 'Login Administrador', error: 'Credenciales CONTRASEÑA incorrectas' });

    req.session.usuario = { id: usuario.id, nombre: usuario.nombre, email: usuario.email };
    res.redirect('/dashboard');
  } catch (error) {
    console.error('ERROR LOGIN:', error);
    res.status(500).render('login', { titulo: 'Login Administrador', error: 'Error al procesar el login' });
  }
};

export const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) console.error('Error cerrar sesión:', err);
    res.redirect('/login');
  });
};

// DASHBOARD
export const mostrarDashboard = async (req, res) => {
  try {
    const totalProductos = await Producto.count();
    const productosActivos = await Producto.count({ where: { activo: true } });
    const productosInactivos = await Producto.count({ where: { activo: false } });
    const totalVentas = await Venta.count();
    const totalUsuarios = await Usuario.count();
    const ventas = await Venta.findAll();
    const ingresosTotales = ventas.reduce((sum, v) => sum + v.total, 0);

    res.render('dashboard', {
      titulo: 'Dashboard',
      usuario: req.session.usuario,
      estadisticas: { totalProductos, productosActivos, productosInactivos, totalVentas, totalUsuarios, ingresosTotales }
    });
  } catch (error) {
    console.error('Error dashboard:', error);
    res.status(500).send('Error al cargar el dashboard');
  }
};

// PRODUCTOS
export const mostrarProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({ order: [['id', 'ASC']] });
    res.render('productos', { titulo: 'Gestión de Productos', usuario: req.session.usuario, productos, mensaje: null });
  } catch (error) {
    console.error('Error productos:', error);
    res.status(500).send('Error al cargar productos');
  }
};

export const mostrarFormularioCrear = async (req, res) => {
  try {
    res.render('producto-form', { titulo: 'Agregar Producto', usuario: req.session.usuario, producto: null, error: null });
  } catch (error) {
    console.error('Error formulario crear:', error);
    res.status(500).send('Error al cargar el formulario');
  }
};

export const mostrarFormularioEditar = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.redirect('/productos');

    res.render('producto-form', { titulo: 'Editar Producto', usuario: req.session.usuario, producto, error: null });
  } catch (error) {
    console.error('Error formulario editar:', error);
    res.status(500).send('Error al cargar el formulario');
  }
};

export const crearProductoHTML = async (req, res) => {
  try {
    const { nombre, precio, descripcion, categoria } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : '';
    if (!nombre || !precio || !categoria) return res.render('producto-form', { titulo: 'Agregar Producto', usuario: req.session.usuario, producto: null, error: 'Nombre, precio y categoría son obligatorios' });

    await Producto.create({ nombre, precio: parseFloat(precio), descripcion: descripcion || '', imagen, categoria, activo: true });
    res.redirect('/productos');
  } catch (error) {
    console.error('Error crear producto:', error);
    res.render('producto-form', { titulo: 'Agregar Producto', usuario: req.session.usuario, producto: null, error: 'Error al crear el producto' });
  }
};

export const editarProductoHTML = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, descripcion, categoria } = req.body;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.redirect('/productos');

    producto.nombre = nombre;
    producto.precio = parseFloat(precio);
    producto.descripcion = descripcion || '';
    producto.imagen = req.file ? `/uploads/${req.file.filename}` : producto.imagen;
    producto.categoria = categoria;
    await producto.save();

    res.redirect('/productos');
  } catch (error) {
    console.error('Error editar producto:', error);
    const producto = await Producto.findByPk(req.params.id);
    res.render('producto-form', { titulo: 'Editar Producto', usuario: req.session.usuario, producto, error: 'Error al editar el producto' });
  }
};

export const desactivarProductoHTML = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (producto) { producto.activo = false; await producto.save(); }
    res.redirect('/productos');
  } catch (error) {
    console.error('Error desactivar producto:', error);
    res.redirect('/productos');
  }
};

export const activarProductoHTML = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (producto) { producto.activo = true; await producto.save(); }
    res.redirect('/productos');
  } catch (error) {
    console.error('Error activar producto:', error);
    res.redirect('/productos');
  }
};

// VENTAS
export const mostrarVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll({ include: [{ model: Producto, through: { attributes: ['cantidad', 'subtotal'] } }], order: [['fecha', 'DESC']] });
    res.render('ventas', { titulo: 'Historial de Ventas', usuario: req.session.usuario, ventas });
  } catch (error) {
    console.error('Error ventas:', error);
    res.status(500).send('Error al cargar ventas');
  }
};

// USUARIOS
export const mostrarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: { exclude: ['pass'] }, order: [['id', 'ASC']] });
    res.render('usuarios', { titulo: 'Gestión de Usuarios', usuario: req.session.usuario, usuarios });
  } catch (error) {
    console.error('Error usuarios:', error);
    res.status(500).send('Error al cargar usuarios');
  }
};
