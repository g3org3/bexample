const express = require('express');
const next = require('next');
const DB = require('./db');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.post('/api/modifiers/:modifierId', ({ params = {} } = {}, res) =>
    DB.Modifier.create({ name: params.modifierId }).then(({ id }) =>
      res.json({ message: 'new modifier added!', id }),
    ),
  );

  server.get('/api/modifiers', (r, res) =>
    DB.Modifier.findAll({
      order: [['id', 'ASC']],
    }).then(modifiers => res.json(modifiers || [])),
  );

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
