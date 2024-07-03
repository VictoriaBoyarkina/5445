import express from 'express';
import { sleep } from '../utils.js';

const router = express.Router();

const defaultUser = {
  email: 'testuser@test.test',
  password: 'test-password',
};

/** @type {import('express').CookieOptions} */
const cookieTokenOptions = {
  httpOnly: true,
  path: '/commonTask',
};

const tokenKey = 'token';
const validToken =
  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJudm9yb2J5b3YiLCJleHAiOjE3MTI4MTczNjEsInJvbGUiOiJVU0VSIn0.8dQRJtlVkHqhyRLldnnHW_MQK6NSd--VJoAJjpWSMnGsOCV96Gk7SHwhPqiXO5IoR2YSFJz3T2za8sqjPTEusA';

router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  await sleep(2);

  if (email !== defaultUser.email || password !== defaultUser.password) {
    return res.status(400).json({
      status: 'error',
      message: '`email` or `password` are not valid',
    });
  }

  return res.cookie(tokenKey, validToken, cookieTokenOptions).json({
    status: 'ok',
  });
});

/** @type {import("express").RequestHandler} */
export function commonTaskTokenCheck(req, res, next) {
  const token = req.cookies.token;

  if (token !== validToken) {
    return res.status(401).json({
      error: true,
      message: 'Unauthorized',
    });
  }

  next();
}

router.get('/user', commonTaskTokenCheck, async (req, res) => {
  await sleep(2);
  return res.json({ email: defaultUser.email });
});

router.delete('/logout', async (req, res) => {
  await sleep(1);
  res.clearCookie(tokenKey, cookieTokenOptions).json({
    status: 'ok',
  });
});

export { router as authRouter };
