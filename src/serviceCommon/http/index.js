import { readFileSync } from 'fs';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const router = express.Router();

router.get('/redirect', (req, res) => {
  res.redirect(`${req.headers.referer}pages/afterRedirect`);
  res.end();
});

router.get('/static-page', (req, res) => {
  const content = readFileSync(__dirname + '/static/index.html');

  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200);
  res.end(content);
});

router.post('/json', (req, res) => {
  const body = req.body || {};

  if (!body.type) {
    res.status(400);
    res.json({
      error: true,
      message: 'field "type" is required',
    });
    return;
  }

  if (Object.keys(body).length === 1) {
    res.status(400);
    res.json({
      error: true,
      message: 'В объекте должны быть ещё свойства кроме свойства `type`',
    });
    return;
  }

  if (body.type === 'create') {
    res.status(201);
  }

  res.json({
    status: 'success',
    data: body,
  });
});

export { router as httpRouter };
