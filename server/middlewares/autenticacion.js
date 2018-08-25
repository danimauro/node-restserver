let Categoria = require('../models/categoria');
const jwt = require('jsonwebtoken');

//==================
// Verificar token
//==================


let verificatoken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: 'Token no válido'
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};

//==================
// Verifica Role
//==================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {

        next();

    } else {

        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });

    }
};

//==================
// Verifica categoria
//==================

let verificaCategoria = (req, res, next) => {

    let body = req.body.categoria;

    Categoria.findOne({ nombre: body })
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (categorias) {
                req.categoria = categorias;
                next();
            } else {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'La categoria ingresada no se encuentra registrada'
                    }
                });
            }

        });

};

//==================
// Verifica token para imagen
//==================

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: 'Token no válido'
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};



module.exports = {
    verificatoken,
    verificaAdmin_Role,
    verificaCategoria,
    verificaTokenImg
}