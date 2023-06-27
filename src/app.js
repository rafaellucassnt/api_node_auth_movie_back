const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Exercício 3 - API completa com Front End básico <br>Brenna Lopes Farace <br>Danilo Augusto Pereira <br>Rafael da Mota Corrêa <br>Rafael da Silveira <br>Rafael Lucas dos Santos')
})

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`)
})