const express = require('express');
const { verificatoken, verificaCategoria, verificaAdmin_Role } = require('../middlewares/autenticacion');
const _ = require('underscore');
const app = express();
let Producto = require('../models/producto');

/**==============================
 * Obtener todos los productos
 ==============================*/

app.get('/productos', (req, res) => {

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .populate('usuario', 'email')
        .populate('categoria', 'nombre')
        .limit(limite)
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.count((err, conteo) => {

                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                })

            });

        });
});

/**==============================
 * Obtener un producto por id
 ==============================*/

app.get('/productos/:id', verificatoken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'email')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        });
});


/**==============================
 * Buscar producto
 ==============================*/

app.get('/productos/buscar/:termino', verificatoken, (req, res) => {

    let termino = req.params.termino;

    //se crea una expresion regular para el termino y asi poder usarlo como parametro de la busqueda
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            //si no hay ningun error
            res.status(201).json({
                ok: true,
                producto: productos
            });
        });

});

/**==============================
 * Crear un nuevo producto
 ==============================*/

app.post('/productos', [verificatoken, verificaCategoria], (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: req.categoria._id,
        usuario: req.usuario._id,

    });

    producto.save((err, resproductoDB) => {
        //si se presenta algun error
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //si no hay ningun error
        res.status(201).json({
            ok: true,
            producto: resproductoDB
        });

    });

});

/**==============================
 * Actualizar un nuevo producto
 ==============================*/

app.put('/productos/:id', verificatoken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, respProductoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!respProductoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no esta registrado'
                }
            });
        }

        respProductoDB.nombre = body.nombre;
        respProductoDB.precioUni = body.precioUni;
        respProductoDB.descripcion = body.descripcion;
        respProductoDB.disponible = body.disponible;
        respProductoDB.categoria = body.categoria;

        respProductoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado
            });

        })

    });
});

/**==============================
 * Eliminar un producto
 ==============================*/

app.delete('/productos/:id', [verificatoken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, respProductoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!respProductoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no esta registrado'
                }
            });
        }


        respProductoDB.disponible = false;

        respProductoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoBorrado
            });

        })

    });

});




module.exports = app;