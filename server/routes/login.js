const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const app = express();


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        //si se presenta algun error
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Validamos si devuelve algun usuario

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: { message: '(Usuario) o contraseña incorrectos' }
            });
        }

        //Validamos si la contaseña es correcta

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: { message: 'Usuario o (contraseña) incorrectos' }
            });
        }

        //creamos el token

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

        //si todo sale bien
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

});



module.exports = app;