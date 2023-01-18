import { readFileSync } from "fs";
import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.get("/redirect", (req, res) => {
  console.log(req.headers);
  res.writeHead(302, { Location: `http://localhost:4000/http/static-page` });
  res.end();
});
router.get("/static-page", (req, res) => {
  const content = readFileSync(__dirname + "/static/index.html");

  res.setHeader("Content-Type", "text/html");
  res.writeHead(200);
  res.end(content);
});

export { router as httpRouter };
