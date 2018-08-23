require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

//parse aplication /x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: false }))

//habilitar la carpeta public para que se pueda acceder externamente

app.use(express.static(path.resolve(__dirname, '../public')));

//parse aplication/json

app.use(bodyParser.json())

//Configuracion global de rutas
app.use(require('./routes/index'));


//conexion con la base de datos
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log("base de datos ONLINE");
});

app.listen(process.env.PORT, () => {
    console.log("escuchando el puerto: ", process.env.PORT);
})