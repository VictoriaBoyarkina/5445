import { readFileSync } from "fs";
import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.get("/test", (req, res) => {
  res.send({ test: "er222" });
});

router.get("/static-page", (req, res) => {
  const content = readFileSync(__dirname + "/static/index.html");

  res.setHeader("Content-Type", "text/html");
  res.writeHead(200);
  res.end(content);
});

export { router as httpRouter };
