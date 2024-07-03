import serverless from 'serverless-http';
import app, { router } from '../src';

router.get('/test', (req, res) => {
  res.json({
    tgest: ' aad',
  });
});
app.use('/.netlify/functions/api', router);

export const handler = serverless(app);
