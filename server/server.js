const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// const routes = require('./routes');
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('server.js smoke test!');
})

// 404 Handler:
app.get('*', (req, res) => {
  res.status(404).send({ message: 'Page not found!' });
});

// Catch-All Error Handler:
app.use(function(err, req, res, next) {
  console.error(err.stack);

  if (err) {
    res.status(500).json({ error: err });
  }

  next();
});

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
})