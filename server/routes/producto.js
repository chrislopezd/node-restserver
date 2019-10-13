const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();
const Producto = require('../models/producto');
// ============================
// Mostrar todos los products
// ============================
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .sort('descripcion')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
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
            });
        })
});
// ============================
// Buscar productos
// ============================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Producto.find({ nombre: regex, disponible: true })
        .sort('descripcion')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productosDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                });
            }
            res.json({
                ok: true,
                productos: productosDB
            });
        });
});
// ============================
// Mostrar un producto por ID
// ============================
app.post('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});
// ============================
// Crear una nuevo producto
// ============================
app.post('/producto', verificaToken, (req, res) => {
    //Regresa una nuevo producto
    //req.usuario._id
    //req.categoria._id
    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //Estatus 201 es por que se crea un nuevo registro
        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });
});
// ============================
// Actualizar una producto
// ============================
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let updateDB = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        categoria: body.categoria,
        disponible: body.disponible,
        descripcion: body.descripcion
    };
    Producto.findByIdAndUpdate(id, updateDB, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});
// ============================
// Eliminar una producto
// ============================
app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let updateDB = {
        disponible: false
    };
    //Producto.findByIdAndRemove(id, (err, productoDB) => {
    Producto.findByIdAndUpdate(id, updateDB, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Producto Borrado'
        });
    });
});
module.exports = app;