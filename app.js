const express = require('express');
const app = express();
const path = require('path');
const port = 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'vistas'));


app.get('/inicioadmin', (req, res) => {
    res.render('inicioadmin');
});



app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
