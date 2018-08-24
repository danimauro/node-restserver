const express = require('express');
const { verificatoken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();
const _ = require('underscore');

let Categoria = require('../models/categoria');

//Mostrar todas las categorias
app.get('/categoria', verificatoken, (req, res) => {

    Categoria.find({})
        .sort('nombre')
        .populate('usureg', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias,
            })

        });

});
//mostrar una categoria por id
app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no esta registrado'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        })

    });

});

//crear nueva categoria
app.post('/categoria', verificatoken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usureg: req.usuario._id,
    });

    categoria.save((err, respcategoriaDB) => {
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
            categoria: respcategoriaDB
        });

    });

});

//Actualizar una categoria por id
app.put('/categoria/:id', verificatoken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true }, (err, respCategoriaDB) => {
        //si se presenta algun error
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!respCategoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no esta registrado'
                }
            });
        }

        res.json({
            ok: true,
            categoria: respCategoriaDB
        });
    });

});

//Eliminar categoria
app.delete('/categoria/:id', [verificatoken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, respCategoriaDB) => {
        //si se presenta algun error
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!respCategoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria eliminada correctamente'
        });
    });

});
module.exports = app;