const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const bodyParser = require('body-parser');
const Usuario = require('../models/usuario');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/usuario', function(req, res) {

    //parametros opciones para paginar el resultado que mostrara el get
    let desde = req.query.desde || 0;
    //convertir el parametro desde a tipo entero
    desde = Number(desde);


    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }).skip(desde).limit(limite).exec((err, usuarios) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        Usuario.count({ estado: true }, (err, conteo) => {

            res.json({
                ok: true,
                usuarios,
                cuantos: conteo
            })

        });

    });

});

app.post('/usuario', function(req, res) {
    let body = req.body;

    let usuario = new Usuario({

        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role

    });

    usuario.save((err, respUsuarioDB) => {
        //si se presenta algun error
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //si no hay ningun error
        res.json({
            ok: true,
            usuario: respUsuarioDB
        });

    });

});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, respUsuarioDB) => {
        //si se presenta algun error
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usaurio: respUsuarioDB
        });
    });
});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, respUsuarioDB) => {
        //si se presenta algun error
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usaurio: respUsuarioDB
        });
    });
});


module.exports = app;