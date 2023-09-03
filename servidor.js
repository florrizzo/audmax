const express = require('express');
const app = express();

app.use(express.static(__dirname)); // Sirve archivos estáticos desde el directorio actual
const port = 8000; // Puerto en el que se ejecutará el servidor

app.listen(port, () => {
  console.log(`Servidor web en ejecución en http://localhost:${port}`);
});
