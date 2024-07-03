import express from 'express';
import { sleep } from '../utils.js';

const router = express.Router();

const COUNTRY_LIST = [
  {
    code: 'ru',
    userLabel: 'Russia',
  },
  {
    code: 'en',
    userLabel: 'USA',
  },
  {
    code: 'de',
    userLabel: 'Germany',
  },
  {
    code: 'ch',
    userLabel: 'China',
  },
  {
    code: 'cn',
    userLabel: 'Canada',
  },
  {
    code: 'jp',
    userLabel: 'Japan',
  },
];

const CONTACT_TYPES = [
  {
    code: 'email',
    userLabel: 'Email',
  },
  {
    code: 'phone',
    userLabel: 'Phone',
  },
  {
    code: 'address',
    userLabel: 'Address',
  },
];

/** @type {Record<string, typeof COUNTRY_LIST[number][]>} */
const DICT_MAP = {
  country: COUNTRY_LIST,
  'contact-type': CONTACT_TYPES,
};

let listRequestCount = 0;

Object.keys(DICT_MAP).forEach((key) => {
  router.get(`/${key}/list`, async (req, res) => {
    listRequestCount++;
    await sleep(2);

    if (listRequestCount >= 6) {
      listRequestCount = 0;
      return res.status(400).json({
        status: 'error',
        message: 'Something went wrong. Please try again later.',
      });
    }

    const data = DICT_MAP[key];

    res.json({
      data,
      status: 'success',
    });
  });

  router.post(`/${key}`, async (req, res) => {
    const { code, userLabel } = req.body || {};

    if (!code || !userLabel) {
      return res.status(400).json({
        message: 'Fields `code` and `userLabel` are required!',
        status: 'error',
      });
    }

    await sleep(2);
    const data = DICT_MAP[key];

    if (data.some((elem) => elem.code === code)) {
      return res.status(400).json({
        status: 'error',
        field: 'code',
        message: `Element with code=${code} already exists`,
      });
    }

    if (data.some((elem) => elem.userLabel === userLabel)) {
      return res.status(400).json({
        status: 'error',
        field: 'userLabel',
        message: `Element with userLabel=${userLabel} already exists`,
      });
    }

    data.push({ code, userLabel });

    res.json({
      data,
      status: 'success',
    });
  });

  router.delete(`/${key}/:code`, async (req, res) => {
    const code = req.params.code;

    if (!code) {
      return res.status(400).json({
        status: 'error',
        message: 'Parameter `code` can`t be empty',
      });
    }

    await sleep(2);
    const data = DICT_MAP[key];

    const elemIndex = data.findIndex((elem) => elem.code === code);

    if (elemIndex < 0) {
      return res.status(404).json({
        status: 'error',
        message: `Element with code=${code} not found`,
      });
    }

    data.splice(elemIndex, 1);

    res.json({
      data,
      status: 'success',
    });
  });
});

export { router as antFormDictionariesRouter };
