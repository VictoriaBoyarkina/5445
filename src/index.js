import cookieParser from 'cookie-parser';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';

import { initGraphQL } from './serviceCommon/graphql/index.js';
import { httpRouter } from './serviceCommon/http/index.js';
import { cookieRouter } from './serviceCommon/cookie/index.js';
import { xhrRouter } from './serviceCommon/xhr/index.js';
import { axiosRouter } from './serviceCommon/axios/index.js';
import { notificationsRouter } from './browserRare/notifications/index.js';
import { rxjsRouter } from './serviceRare/RxJS/index.js';
import { reactRoutingGuardsRouter } from './reactCommon/routingGuard/index.js';
import { initSocket } from './mentorTask/socket.js';
import { chartDataRouter } from './mentorTask/chartData.js';
import { authRouter } from './mentorTask/auth.js';
import { templateDataRouter } from './mentorTask/template.js';
import { antFormDictionariesRouter } from './antForms/dictionaries.js';

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

const app = express();
const httpServer = createServer(app);

const init = async () => {
  app.use(cookieParser());
  app.use(cors());
  app.use(express.json());
  app.use(
    express.urlencoded({
      // to support URL-encoded bodies
      extended: true,
    }),
  );

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', [CLIENT_URL]);
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
  });

  await initGraphQL(app, httpServer);

  /* Mentor Task START */
  initSocket(app, httpServer);
  app.use('/commonTask/chartData', chartDataRouter);
  app.use('/commonTask/auth', authRouter);
  app.use('/commonTask/template', templateDataRouter);
  /* Mentor Task END */

  /* Browser Rare START */
  app.use('/notifications', notificationsRouter);
  /* Browser Rare END */

  /* Service Common START */
  app.use('/http', httpRouter);
  app.use('/cookie', cookieRouter);
  app.use('/xhr', xhrRouter);
  app.use('/axios', axiosRouter);
  /* Service Common END */

  /* Service Rare START */
  app.use('/rxjs', rxjsRouter);
  /* Service Rare END */

  /* React Common START */
  app.use('/reactGuard', reactRoutingGuardsRouter);
  /* React Common END */

  /* Ant Design Forms START */
  app.use('/ant-forms', antFormDictionariesRouter);
  /* Ant Design Forms END */
};

init();

// httpServer.listen(PORT, () => {
//   console.log(
//     `✅ \x1b[35mServer is running on \x1b[36mhttp://localhost:${PORT}\x1b[0m`,
//   );
//   console.log(
//     `✅ \x1b[35mGraphQL Query endpoint ready at \x1b[36mhttp://localhost:${PORT}/graphql\x1b[0m`,
//   );
//   console.log(
//     `✅ \x1b[35mGraphQl Subscription endpoint ready at \x1b[36mws://localhost:${PORT}/subscription\x1b[0m`,
//   );
// });

export default app;
