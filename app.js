const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Express andando desde VS Code!');
});

app.listen(port, () => {
  console.log(`Servidor iniciado en: http://localhost:${port}`);
});
