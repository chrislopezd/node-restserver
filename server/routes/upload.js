const express = require('express');
const fileUpload = require('express-fileupload');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));
// ============================
// Sube archivos
// ============================
app.put('/upload/:tipo/:id', verificaToken, (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }
    //Validar tipo
    let tipos = ['usuarios', 'productos'];
    if (tipos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Las tipos validos son: ' + tipos.join(', '),
                tipo
            }
        });
    }


    let file = req.files.archivo;
    let nombreArchivo = file.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];
    //Extensiones permitidas
    let extensionesValidas = ['jpg', 'png', 'jpeg', 'gif'];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Las extensiones validas son: ' + extensionesValidas.join(', '),
                extension
            }
        });
    }
    //Cambiar el nombre del archivo
    let fileName = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;
    file.mv(`uploads/${ tipo }/${ fileName }`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //Imagen cargada dependiento el tipo
        if (tipo == 'usuarios') {
            imagenUsuario(id, res, fileName);
        } else {
            imagenProducto(id, res, fileName);
        }
    });
});

function imagenUsuario(id, res, fileName) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(fileName, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borraArchivo(fileName, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }
        borraArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = fileName;
        usuarioDB.save((err, usuarioDBG) => {
            res.json({
                ok: true,
                usuario: usuarioDBG,
                img: fileName
            });
        });
    });
}

function imagenProducto(id, res, fileName) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(fileName, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borraArchivo(fileName, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }
        borraArchivo(productoDB.img, 'productos');
        productoDB.img = fileName;
        productoDB.save((err, productoDBG) => {
            res.json({
                ok: true,
                producto: productoDBG,
                img: fileName
            });
        });
    });
}

function borraArchivo(fileName, tipo) {
    //Se valida si existe una imagen anterior y si existe la eliminamos
    let pathUrl = path.resolve(__dirname, `../../uploads/${ tipo }/${ fileName }`);
    if (fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl);
    }
}
module.exports = app;