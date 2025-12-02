const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const port = 3000;

// Array de productos
let productos = [];

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'vistas')); // tu carpeta de EJS

// Crear carpeta uploads si no existe
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// RUTA PRINCIPAL → INDEX.HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Configuración Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes'));
  }
});

// RUTA PARA FORMULARIO EJS
app.get('/cargarproducto', (req, res) => {
  res.render('cargarproducto'); 
});

// AGREGAR PRODUCTO
app.post('/api/productos', upload.single('imagen'), (req, res) => {
  try {
    const { titulo, descripcion, categoria, precio, cantidad } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Se requiere una imagen' });
    }

    const nuevoProducto = {
      id: productos.length + 1,
      titulo,
      descripcion,
      categoria,
      precio: parseFloat(precio),
      cantidad: parseInt(cantidad),
      imagen: req.file.filename,
      fechaCreacion: new Date()
    };

    productos.push(nuevoProducto);

    res.json({
      success: true,
      mensaje: 'Producto agregado correctamente',
      producto: nuevoProducto
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LISTAR PRODUCTOS
app.get('/api/productos', (req, res) => {
  res.json(productos);
});

// RUTA MENU (tu prueba)
app.post('/menu', (req, res) => {
  const { tipoMascota } = req.body;

  if (tipoMascota === "perro") {
    res.send("Lista de productos para perros");
  } else if (tipoMascota === "gato") {
    res.send("Lista de productos para gatos");
  } else {
    res.send("No se seleccionó mascota");
  }
});

// INICIAR SERVIDOR
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
