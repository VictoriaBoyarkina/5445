import cookieParser from "cookie-parser";
import express from "express";
import { createServer } from "http";
import { initGraphQL } from "./graphql/index.js";
import cors from "cors";
import { httpRouter } from "./http/index.js";
import bodyParser from "body-parser";
import { cookieRouter } from "./cookie/index.js";

const PORT = process.env.PORT || 4000;

const app = express();
const httpServer = createServer(app);

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", ["http://localhost:3000"]);
  res.header("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  // res.setHeader("Access-Control-Allow-Headers", ["Content-Type", "Accept"]);
  next();
});

await initGraphQL(app, httpServer);

app.use("/http", httpRouter);
app.use("/cookie", cookieRouter);

app.get("/test", (req, res) => {
  res.send({ test: "er" });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
  console.log(
    `🚀 Subscription endpoint ready at ws://localhost:${PORT}/subscription`
  );
});
