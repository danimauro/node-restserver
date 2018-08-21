require('./config/config');

const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.use(require('./routes/usuario'));


//conexion con la base de datos
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log("base de datos ONLINE");
});

app.listen(process.env.PORT, () => {
    console.log("escuchando el puerto: ", process.env.PORT);
})