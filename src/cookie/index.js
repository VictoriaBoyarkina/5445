import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  res.json(req.cookies);
});

export { router as cookieRouter };
