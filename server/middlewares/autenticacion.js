const jwt = require('jsonwebtoken');
// ================
// VERIFICA TOKEN
// ================
let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};
// ================
// VERIFICA ROL
// ================
let verificaRol = (req, res, next) => {
    let usuario = req.usuario;
    jwt.verify(usuario, process.env.SEED, (err, decoded) => {
        if (usuario.role === 'ADMIN_ROLE') {
            next();
        } else {
            return res.json({
                ok: false,
                err: {
                    message: 'El usuario no es Administrador'
                }
            });
        }
    });
};

// ============================
// VERIFICA TOKEN POR PARAMETRO
// ============================
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

module.exports = {
    verificaToken,
    verificaRol,
    verificaTokenImg
}