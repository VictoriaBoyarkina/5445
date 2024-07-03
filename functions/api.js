import serverless from 'serverless-http';
import app, { router } from '../src';

app.use('/.netlify/functions/api', router);

export const handler = serverless(app);
