const Joi = require('joi');
const express = require('express');

const app = express();
app.use(express.json());

const surats = [
    { id: 1, name: 'Al Fatihah' },
    { id: 2, name: 'Al Baqarah' },
    { id: 3, name: 'Ali Imran' },
]

app.get('/api', (req, res) => {
    res.send('Hello World');
});

app.get('/api/surat', (req, res) => {
    res.send(surats);
});

app.post('/api/surat', (req, res) => {
    
    const schema = {
        name: Joi.string().min(3).required()
    };

    const result = Joi.validate( req.body, schema);

    if (result.error) {
        res.status(404).send(result.error.details[0].message);
        return;
    };

    const surat = {
        id: surats.length + 1,
        name: req.body.name
    };

    surats.push(surat);
    res.send(surat);
});

app.get('/api/surat/cari', (req, res) => {
    res.send(req.query.query);
});

app.get('/api/surat/:suratID', (req, res) => {
    const surat = surats.find( c => c.id === parseInt(req.params.suratID));
    if(!surat) res.status(404).send('The page you are looking for not found');
    res.send(surat);
});

app.put('/api/surat/:suratID', (req, res) => {

    const surat = surats.find( c => c.id === parseInt(req.params.suratID));
    if (!surat) res.status(404).send('The page you are looking for not found');
  
    const { error } = validateSurat(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    surat.name = req.body.name;
    res.send(surat);

});

app.get('/api/surat/:suratID/ayat/:ayatID', (req, res) => {
    res.send([req.params.suratID, req.params.ayatID]);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});

function validateSurat(surat) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(surat, schema);
};