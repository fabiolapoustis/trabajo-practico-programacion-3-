const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const port = 3000;

// Array de productos en memoria
let productos = [];

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'vistas'));

// Crear carpeta uploads si no existe
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Rutas principales
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/productos.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "productos.html"));
});

// Configuración Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Solo se permiten imágenes'));
  }
});

// Formulario de carga de producto
app.get('/cargarproducto', (req, res) => {
  res.render('cargarproducto'); 
});

// Agregar producto
app.post('/api/productos', upload.single('imagen'), (req, res) => {
  try {
    const { titulo, descripcion, categoria, precio, cantidad } = req.body;

    if (!req.file) return res.status(400).json({ error: 'Se requiere una imagen' });

    const nuevoProducto = {
      id: productos.length + 1,
      nombre: titulo, // <- importante para que coincida con productos.js
      descripcion,
      categoria,
      precio: parseFloat(precio),
      cantidad: parseInt(cantidad),
      imagen: req.file.filename,
      fechaCreacion: new Date()
    };

    productos.push(nuevoProducto);

    res.json({ success: true, producto: nuevoProducto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar productos
app.get('/api/productos', (req, res) => {
  res.json({ productos }); // <-- devuelve objeto, como espera productos.js
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
