import express from "express";

import { fileURLToPath } from "url";
import { dirname } from "path";
import { isEqual } from "lodash-es";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { upload } from "../../utils.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get("/", (req, res) => {
  res.json([
    {
      id: 1,
      name: "mouse",
    },
    {
      id: 2,
      name: "keyboard",
    },
    {
      id: 3,
      name: "monitor",
    },
  ]);
});

router.get("/file", async (req, res) => {
  const imgUrl = __dirname + "/static/cat_gruzin.jpg";

  const size = (await stat(imgUrl)).size;

  res.setHeader("Content-Type", "image/jpg");
  res.setHeader("Content-Length", size);

  const readStream = createReadStream(imgUrl);

  readStream.pipe(res);

  res.on("close", () => {
    readStream.destroy();
  });
});

router.post("/upload", upload.single("file"), (req, res) => {
  return res.json({
    path: req.file.path,
  });
});

router.put("/json", (req, res) => {
  if (Array.isArray(req.body) || typeof req.body === "string" || !req.body) {
    res.status(400);
    res.json({
      error: true,
      message: "request body must be Object",
    });
    return;
  }

  const body = req.body || {};

  res.json({
    result: "success",
    sendedJSON: {
      ...body,
      keysCount: Object.keys(body).length,
    },
  });
});

const timestamp = Date.now();
router.patch("/json", (req, res) => {
  const body = req.body;
  const err = {
    err: true,
    message: "Отправьте в body полученный JSON, чтобы избавиться от ошибки. ",
    timestamp,
  };

  if (isEqual(err, body)) {
    res.json({
      message: "success",
    });
    return;
  }

  res.status(400);
  res.json(err);
});

router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  if (!["123", "test", "id", "awd"].includes(id)) {
    res.status(400);
    res.json({
      message: "Придумай другой id",
    });
    return;
  }

  res.json({
    message: "success",
  });
});

router.get("/long", (req, res) => {
  setTimeout(() => {
    res.json({
      message: "success",
    });
  }, 2000);
});

export { router as xhrRouter };
