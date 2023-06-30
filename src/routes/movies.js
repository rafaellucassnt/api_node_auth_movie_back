const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Listar todos os filmes
router.get('/', (req, res) => {
    db.select('*')
        .from('filmes')
        .then((filmes) => {
            res.json(filmes);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Ocorreu um erro ao listar os filmes.' });
        });
});

// Obter um filme por ID
router.get('/:id', (req, res) => {
    const id = req.params.id;

    db.select('*')
        .from('filmes')
        .where({ id: id })
        .first()
        .then((filme) => {
            if (filme) {
                res.json(filme);
            } else {
                res.status(404).json({ error: 'Filme não encontrado.' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Ocorreu um erro ao obter o filme.' });
        });
});

// Adicionar um novo filme
router.post('/', (req, res) => {

    console.log(req.body.debut);
    const filme = req.body;

    db.insert({
        title: req.body.title,
        debut: req.body.debut,
        genre: JSON.stringify(req.body.genre),
        duration: req.body.duration,
        origin: req.body.origin,
        direction: req.body.direction,
        script: req.body.script,
        distributor: req.body.distributor,
        classification: req.body.classification,
        year: req.body.year,
        synopsis: req.body.synopsis,
        img: req.body.img
    })
        .into('filmes')
        .then(() => {
            res.status(201).json({ message: 'Filme adicionado com sucesso.' });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Ocorreu um erro ao adicionar o filme.' });
        });
});

// Atualizar um filme
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const filme = req.body;

    db('filmes')
        .where({ id: id })
        .update({
            title: req.body.title,
            debut: req.body.debut,
            genre: JSON.stringify(req.body.genre),
            duration: req.body.duration,
            origin: req.body.origin,
            direction: req.body.direction,
            script: req.body.script,
            distributor: req.body.distributor,
            classification: req.body.classification,
            year: req.body.year,
            synopsis: req.body.synopsis,
            img: req.body.img
        })
        .then((updated) => {
            if (updated) {
                res.json({ message: 'Filme atualizado com sucesso.' });
            } else {
                res.status(404).json({ error: 'Filme não encontrado.' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Ocorreu um erro ao atualizar o filme.' });
        });
});

// Excluir um filme
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    db('filmes')
        .where({ id: id })
        .del()
        .then((deleted) => {
            if (deleted) {
                res.json({ message: 'Filme excluído com sucesso.' });
            } else {
                res.status(404).json({ error: 'Filme não encontrado.' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Ocorreu um erro ao excluir o filme.' });
        });
});

module.exports = router;