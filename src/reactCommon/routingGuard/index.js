import express from "express";

const router = express.Router();

const tokens = {
  admin: [],
  user: [],
};

const users = [
  {
    id: "ld1a61aosmk52r8ufl",
    login: "user",
    password: "password",
    username: "testName",
    roles: ["user"],
    color: "#4664de",
  },
  {
    id: "ld1a61aosmk52r8uf2",
    login: "admin",
    password: "password",
    username: "testName1",
    roles: ["admin"],
    color: "#fefb56",
  },
];

function generateToken(user, role) {
  const token = Buffer.from(
    JSON.stringify({
      ...user,
      loginTime: Date.now(),
    })
  ).toString("base64");

  tokens[role].push(token);

  return token;
}

/** @type {import("express").RequestHandler} */
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.replace("Bearer ", "");

  if (token && (tokens.user.includes(token) || tokens.admin.includes(token))) {
    req._token = token;
    return next();
  }

  return res.status(401).json({
    error: true,
    message: "Unauthorized",
  });
};

/** @type {import("express").RequestHandler} */
const adminAuthMiddleware = (req, res, next) => {
  const token = req.headers["authorization"].replace("Bearer ", "");

  if (!tokens.admin.includes(token)) {
    return res.status(403).json({
      error: true,
      message: "Not have access",
    });
  }

  next();
};

router.post("/login", (req, res) => {
  const body = req.body;
  if (!body.login || !body.password) {
    return res.status(400).json({
      error: true,
      message: "Поля login и password не могут быть пустыми",
    });
  }

  const user = users.find(
    ({ login, password }) => login === body.login && password === body.password
  );

  if (!user) {
    return res.status(400).json({
      error: true,
      message: "login или password введены неверно",
    });
  }

  res.json({
    token: generateToken(user, user.roles[0]),
    user,
  });
});

router.get("/logout", authMiddleware, (req, res) => {
  const token = req._token;
  tokens.user = tokens.user.filter((el) => el !== token);
  tokens.admin = tokens.admin.filter((el) => el !== token);

  res.json({
    message: "success",
  });
});

router.get("/onlyAuthUserOrAdmin", authMiddleware, (req, res) => {
  res.json({
    status: "success",
    data: "This data only for user or admin!!!",
  });
});

router.get(
  "/onlyAuthAdmin",
  authMiddleware,
  adminAuthMiddleware,
  (req, res) => {
    res.json({
      status: "success",
      data: "This data only for admin!!!",
    });
  }
);

export { router as reactRoutingGuardsRouter };
