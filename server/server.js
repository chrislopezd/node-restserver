require('./config/config');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


app.get('/usuario', (req, res) => {
    res.json({ "msg": 'Hola GET!' });
});

app.post('/usuario', (req, res) => {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            msg: 'El nombre es necesario'
        });
    } else {
        res.json({ persona: body });
    }
});
//Update
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({ id });
});
//Delete
app.delete('/usuario', (req, res) => {
    res.json({ "msg": 'Hola DELETE!' });
});


app.listen(process.env.PORT, () => {
    console.log(`Escuchando peticiones en el puerto ${ process.env.PORT }`);
});