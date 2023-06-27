const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Função para gerar o token JWT
function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    roles: user.roles
  };

  const options = {
    expiresIn: '1h' // Token expira em 1 hora
  };

  return jwt.sign(payload, 'secret', options);
}

// Rota para criar um novo usuário
router.post('/', (req, res) => {
  const { name, username, email, password, roles } = req.body;

  // Verificar se o usuário já existe no banco de dados
  db.select('*')
    .from('usuarios')
    .where('username', username)
    .first()
    .then((user) => {
      if (user) {
        return res.status(409).json({ error: 'Usuário já existe.' });
      }

      // Criptografar a senha
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ error: 'Ocorreu um erro durante o registro.' });
        }

        // Inserir o novo usuário no banco de dados
        db('usuarios')
          .insert({ name, username, email, password: hash, roles })
          .then(() => {
            res.status(201).json({ message: 'Usuário registrado com sucesso.' });
          })
          .catch((error) => {
            res.status(500).json({ error: 'Ocorreu um erro durante o registro.' });
          });
      });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Ocorreu um erro durante o registro.' });
    });
});

// Rota para obter todos os usuários
router.get('/', (req, res) => {
  db.select('*')
    .from('usuarios')
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Ocorreu um erro ao obter os usuários.' });
    });
});

// Rota para obter um usuário pelo ID
router.get('/:id', (req, res) => {
  const id = req.params.id;

  db.select('*')
    .from('usuarios')
    .where('id', id)
    .first()
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'Usuário não encontrado.' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Ocorreu um erro ao obter o usuário.' });
    });
});

// Rota para atualizar um usuário pelo ID
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { name, username, email, password, roles } = req.body;

  // Criptografar a senha
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: 'Ocorreu um erro durante a atualização do usuário.' });
    }

    // Atualizar o usuário no banco de dados
    db('usuarios')
      .where('id', id)
      .update({ name, username, email, password: hash, roles })
      .then((updated) => {
        if (updated) {
          res.json({ message: 'Usuário atualizado com sucesso.' });
        } else {
          res.status(404).json({ error: 'Usuário não encontrado.' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Ocorreu um erro durante a atualização do usuário.' });
      });
  });
});

// Rota para excluir um usuário pelo ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  db('usuarios')
    .where('id', id)
    .del()
    .then((deleted) => {
      if (deleted) {
        res.json({ message: 'Usuário excluído com sucesso.' });
      } else {
        res.status(404).json({ error: 'Usuário não encontrado.' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Ocorreu um erro ao excluir o usuário.' });
    });
});

module.exports = router;
