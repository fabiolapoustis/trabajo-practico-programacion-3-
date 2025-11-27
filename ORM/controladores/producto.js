import { Producto } from "../modelos/index.js";


// GET - Obtener todos los productos (con paginación)
export const getProducto = async (req, res) => {
    try {
        const { page = 1, limit = 10, categoria, activo } = req.query;
        
        const offset = (page - 1) * limit;
        
        // Filtros opcionales
        const where = {};
        if (categoria) where.categoria = categoria;
        if (activo !== undefined) where.activo = activo === 'true';

        const { count, rows } = await Producto.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['id', 'ASC']]
        });

        res.json({
            productos: rows,
            totalProductos: count,
            totalPaginas: Math.ceil(count / limit),
            paginaActual: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET - Obtener un producto por ID
export const getProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST - Crear un nuevo producto
export const crearProducto = async (req, res) => {
    try {
        const { nombre, precio, descripcion, imagen, categoria } = req.body;

        // Validaciones básicas
        if (!nombre || !precio || !categoria) {
            return res.status(400).json({ 
                error: "Nombre, precio y categoría son obligatorios" 
            });
        }

        if (precio <= 0) {
            return res.status(400).json({ 
                error: "El precio debe ser mayor a 0" 
            });
        }

        const producto = await Producto.create({
            nombre,
            precio,
            descripcion: descripcion || "",
            imagen: imagen || "",
            categoria,
            activo: true // Por defecto activo
        });

        res.status(201).json({
            mensaje: "Producto creado exitosamente",
            producto
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT - Modificar un producto existente
export const modificarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, descripcion, imagen, categoria, activo } = req.body;

        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Validaciones
        if (precio !== undefined && precio <= 0) {
            return res.status(400).json({ 
                error: "El precio debe ser mayor a 0" 
            });
        }

        // Actualizar solo los campos enviados
        if (nombre !== undefined) producto.nombre = nombre;
        if (precio !== undefined) producto.precio = precio;
        if (descripcion !== undefined) producto.descripcion = descripcion;
        if (imagen !== undefined) producto.imagen = imagen;
        if (categoria !== undefined) producto.categoria = categoria;
        if (activo !== undefined) producto.activo = activo;

        await producto.save();

        res.json({
            mensaje: "Producto modificado exitosamente",
            producto
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE - Baja lógica (desactivar)
export const desactivarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        producto.activo = false;
        await producto.save();

        res.json({
            mensaje: "Producto desactivado exitosamente",
            producto
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT - Activar producto
export const activarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        producto.activo = true;
        await producto.save();

        res.json({
            mensaje: "Producto activado exitosamente",
            producto
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET - Obtener solo productos activos (para el cliente)
export const getProductosActivos = async (req, res) => {
    try {
        const { page = 1, limit = 10, categoria } = req.query;
        
        const offset = (page - 1) * limit;
        
        const where = { activo: true };
        if (categoria) where.categoria = categoria;

        const { count, rows } = await Producto.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['id', 'ASC']]
        });

        res.json({
            productos: rows,
            totalProductos: count,
            totalPaginas: Math.ceil(count / limit),
            paginaActual: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};