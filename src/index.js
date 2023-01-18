import express from "express";
import { createServer } from "http";
import { initGraphQL } from "./graphql/index.js";
import { httpRouter } from "./http/index.js";

const PORT = process.env.PORT || 4000;

const app = express();
const httpServer = createServer(app);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", ["*"]);
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

await initGraphQL(app, httpServer);

app.use("/http", httpRouter);

app.get("/test", (req, res) => {
  res.send({ test: "er" });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
  console.log(
    `🚀 Subscription endpoint ready at ws://localhost:${PORT}/subscription`
  );
});
