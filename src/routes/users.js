const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');



router.checkToken = (req, res, next) => {
  let authInfo = req.get('authorization')
  console.log(authInfo);
  if (authInfo) {
      const [bearer, token] = authInfo.split(' ')
      
      if (!/Bearer/.test(bearer)) {
      res.status(400).json({ message: 'Tipo de token esperado não informado...', error: true })
      return 
      }

      jwt.verify(token, process.env.SECRET_KEY, (err, decodeToken) => {
          if (err) {
              res.status(401).json({ message: 'Acesso negado'})
              return
          }
          req.usuarioId = decodeToken.id
          req.roles = decodeToken.roles
          next()
      })
  } 
  else
      res.status(401).json({ message: 'Acesso negado'})
}

router.isAdmin = (req, res, next) => {
  if (req.roles?.split(';').includes('ADMIN')){
      next()
  }
  else {
      res.status(403).json({ message: 'Acesso negado'})
  }
}

router.post('/login', function (req, res) {
  db.select('*').from('usuarios').where( { username: req.body.username })
  .then( usuarios => {
      if(usuarios.length){
          let usuario = usuarios[0]
          let checkSenha = bcrypt.compareSync (req.body.password, usuario.password)
          if (checkSenha) {
             var tokenJWT = jwt.sign({ id: usuario.id, roles: usuario.roles }, 
                  process.env.SECRET_KEY, {
                    expiresIn: 3600
                  })

              res.status(200).json ({
                  id: usuario.id,
                  username: usuario.username, 
                  nome: usuario.nome, 
                  roles: usuario.roles,
                  token: tokenJWT
              })  
              return 
          }
      } 
        
      res.status(401).json({ message: 'Login ou password incorretos' })
  })
  .catch (err => {
      res.status(500).json({ 
         message: 'Erro ao verificar login - ' + err.message })
  })

})
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

      // Criptografar a password
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

  // Criptografar a password
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
