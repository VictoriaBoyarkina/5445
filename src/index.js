import cookieParser from "cookie-parser";
import express from "express";
import { createServer } from "http";
import cors from "cors";

import { initGraphQL } from "./graphql/index.js";
import { httpRouter } from "./http/index.js";
import { cookieRouter } from "./cookie/index.js";
import { xhrRouter } from "./xhr/index.js";
import { axiosRouter } from "./axios/index.js";

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

const app = express();
const httpServer = createServer(app);

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", [CLIENT_URL]);
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  next();
});

await initGraphQL(app, httpServer);

app.use("/http", httpRouter);
app.use("/cookie", cookieRouter);
app.use("/xhr", xhrRouter);
app.use("/axios", axiosRouter);

httpServer.listen(PORT, () => {
  console.log(
    `✅ \x1b[35mServer is running on \x1b[36mhttp://localhost:${PORT}\x1b[0m`
  );
  console.log(
    `✅ \x1b[35mGraphQL Query endpoint ready at \x1b[36mhttp://localhost:${PORT}/graphql\x1b[0m`
  );
  console.log(
    `✅ \x1b[35mGraphQl Subscription endpoint ready at \x1b[36mws://localhost:${PORT}/subscription\x1b[0m`
  );
});
