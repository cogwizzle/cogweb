const { response } = require('express');
const express = require('express');
const app = express();
const port = 3000;

const rootPaths = ['/', '/blog/'];

rootPaths.forEach((path) => {
  app.use(`${path}src`, express.static('src'));
  app.use(`${path}api`, express.static('api'));
});

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});
