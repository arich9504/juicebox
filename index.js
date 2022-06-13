require('dotenv').config();

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2NTUwNzg1Njd9.q_kLefwa6AJFaMC0Rk_zS5bmX4xFw5Kn6bnfaKiTstA

const PORT = 3000;
const express = require('express');
const server = express();

const morgan = require('morgan');
server.use(morgan('dev'));

server.use(express.json())

const apiRouter = require('./api');
server.use('/api', apiRouter);

const { client } = require('./db');
client.connect();

server.get('/background/:color', (req, res, next) => {
  res.send(`
    <body style="background: ${ req.params.color };">
      <h1>Hello World</h1>
    </body>
  `);
});

server.get('/add/:first/to/:second', (req, res, next) => {
  res.send(`<h1>${ req.params.first } + ${ req.params.second } = ${
    Number(req.params.first) + Number(req.params.second)
   }</h1>`);
});

server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});