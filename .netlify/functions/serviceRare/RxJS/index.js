import express from "express";
import { randomNumberRange } from "../../utils.js";

const router = express.Router();

const users = [
  {
    id: "ld1a61aosmk52r8ufl",
    login: "test",
    password: "test",
    username: "testName",
    color: "#4664de",
  },
  {
    id: "ld1a61aosmk52r8uf2",
    login: "test1",
    password: "test1",
    username: "testName1",
    color: "#fefb56",
  },
];

const usersMap = users.reduce((res, user) => {
  return {
    ...res,
    [user.id]: user,
  };
}, {});

router.get("/activeUsers", (req, res) => {
  res.json(Object.keys(usersMap));
});

router.get("/user/:userId", (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({
      error: true,
      message: "userId не может быть пустым",
    });
  }

  if (!Object.keys(usersMap).includes(userId)) {
    return res.status(404).json({
      error: true,
      message: `Пользователь с id = ${userId} не найден`,
    });
  }

  setTimeout(() => {
    res.json(usersMap[userId]);
  }, randomNumberRange(1, 4) * 1000);
});

export { router as rxjsRouter };
