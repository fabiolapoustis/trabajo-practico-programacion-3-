import { Usuario } from "../modelos/index.js";
import { Producto } from "../modelos/producto.js";
import { Venta } from "../modelos/venta.js";

export const mostrarLogin = async (req, res) => {
  try {
    if (req.session.usuario) {
      return res.redirect('/admin/dashboard');
    }
    res.render('admin/login', { 
      titulo: 'Login Administrador',
      error: null 
    });
  } catch (error) {
    res.status(500).render('admin/login', { 
      titulo: 'Login Administrador',
      error: 'Error al cargar la página' 
    });
  }
};

export const procesarLogin = async (req, res) => {
  try {
    const { email, pass } = req.body;

    if (!email || !pass) {
      return res.render('admin/login', {
        titulo: 'Login Administrador',
        error: 'Email y contraseña son requeridos'
      });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    
    if (!usuario) {
      return res.render('admin/login', {
        titulo: 'Login Administrador',
        error: 'Credenciales incorrectas'
      });
    }

    const passwordValido = await usuario.compararPassword(pass);

    if (!passwordValido) {
      return res.render('admin/login', {
        titulo: 'Login Administrador',
        error: 'Credenciales incorrectas'
      });
    }

    req.session.usuario = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email
    };

    res.redirect('/admin/dashboard');

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).render('admin/login', {
      titulo: 'Login Administrador',
      error: 'Error al procesar el login'
    });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
    }
    res.redirect('/admin/login');
  });
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
      titulo: 'Dashboard',
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
      titulo: 'Gestión de Productos',
      usuario: req.session.usuario,
      productos,
      mensaje: null
    });
  } catch (error) {
    console.error('Error al cargar productos:', error);
    res.status(500).send('Error al cargar productos');
  }
};

export const mostrarFormularioCrear = async (req, res) => {
  try {
    res.render('admin/producto-form', {
      titulo: 'Agregar Producto',
      usuario: req.session.usuario,
      producto: null, 
      error: null
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error al cargar el formulario');
  }
};

export const mostrarFormularioEditar = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.redirect('/admin/productos');
    }

    res.render('admin/producto-form', {
      titulo: 'Editar Producto',
      usuario: req.session.usuario,
      producto, 
      error: null
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error al cargar el formulario');
  }
};

export const crearProductoHTML = async (req, res) => {
  try {
    const { nombre, precio, descripcion, categoria } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : '';

    if (!nombre || !precio || !categoria) {
      return res.render('admin/producto-form', {
        titulo: 'Agregar Producto',
        usuario: req.session.usuario,
        producto: null,
        error: 'Nombre, precio y categoría son obligatorios'
      });
    }

    await Producto.create({
      nombre,
      precio: parseFloat(precio),
      descripcion: descripcion || '',
      imagen,
      categoria,
      activo: true
    });

    res.redirect('/admin/productos');
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.render('admin/producto-form', {
      titulo: 'Agregar Producto',
      usuario: req.session.usuario,
      producto: null,
      error: 'Error al crear el producto'
    });
  }
};

export const editarProductoHTML = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, descripcion, categoria } = req.body;
    
    const producto = await Producto.findByPk(id);
    
    if (!producto) {
      return res.redirect('/admin/productos');
    }
    const imagen = req.file ? `/uploads/${req.file.filename}` : producto.imagen;

    producto.nombre = nombre;
    producto.precio = parseFloat(precio);
    producto.descripcion = descripcion || '';
    producto.imagen = imagen;
    producto.categoria = categoria;

    await producto.save();

    res.redirect('/admin/productos');
  } catch (error) {
    console.error('Error al editar producto:', error);
    const producto = await Producto.findByPk(req.params.id);
    res.render('admin/producto-form', {
      titulo: 'Editar Producto',
      usuario: req.session.usuario,
      producto,
      error: 'Error al editar el producto'
    });
  }
};

export const desactivarProductoHTML = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (producto) {
      producto.activo = false;
      await producto.save();
    }

    res.redirect('/admin/productos');
  } catch (error) {
    console.error('Error al desactivar producto:', error);
    res.redirect('/admin/productos');
  }
};

export const activarProductoHTML = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (producto) {
      producto.activo = true;
      await producto.save();
    }

    res.redirect('/admin/productos');
  } catch (error) {
    console.error('Error al activar producto:', error);
    res.redirect('/admin/productos');
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
      titulo: 'Historial de Ventas',
      usuario: req.session.usuario,
      ventas
    });
  } catch (error) {
    console.error('Error al cargar ventas:', error);
    res.status(500).send('Error al cargar ventas');
  }
};

export const mostrarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['pass'] },
      order: [['id', 'ASC']]
    });

    res.render('admin/usuarios', {
      titulo: 'Gestión de Usuarios',
      usuario: req.session.usuario,
      usuarios
    });
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    res.status(500).send('Error al cargar usuarios');
  }
};