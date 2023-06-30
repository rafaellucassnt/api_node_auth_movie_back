const express = require('express')
const app = express()
const moviesRouter = require('./routes/movies');
const usersRouter = require('./routes/users');

const port = 3000

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Exercício 3 - API completa com Front End básico <br>Brenna Lopes Farace <br>Danilo Augusto Pereira <br>Rafael da Mota Corrêa <br>Rafael da Silveira <br>Rafael Lucas dos Santos')
})

app.use('/filmes', moviesRouter);
app.use('/usuarios', usersRouter);

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`)
})