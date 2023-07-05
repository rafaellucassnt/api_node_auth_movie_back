const express = require('express')
const cors = require('cors');
const app = express()
const moviesRouter = require('./routes/movies');
const usersRouter = require('./routes/users');
require('dotenv').config()

console.log('Chave:', process.env.SECRET_KEY)

const port = 3000

app.use(cors());

app.use(express.json());

app.use (express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Exercício 3 - API completa com Front End básico <br>Brenna Lopes Farace <br>Danilo Augusto Pereira <br>Rafael da Mota Corrêa <br>Rafael da Silveira <br>Rafael Lucas dos Santos')
})

// app.use('/filmes', moviesRouter);

app.use('/filmes', moviesRouter);
app.use('/usuarios', usersRouter);

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`)
})