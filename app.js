const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const multer = require('multer');

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'vistas'));


app.get('/inicioadmin', (req, res) => {
    res.render('inicioadmin');
});



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});


const upload = multer({ storage: storage });


app.get('/cargarproducto', (req, res) => {
    res.render('cargarproducto');
});



app.post('/cargarproducto', upload.single('imagen'), (req, res) => {
    const { titulo, categoria, peso, precio } = req.body;
    const imagen = req.file.filename;
    
    console.log({
        titulo,
        categoria,
        peso,
        precio,
        imagen
    });
    
    res.send("Producto cargado correctamente");
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});