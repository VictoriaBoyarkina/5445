import express from 'express';
import { commonTaskTokenCheck } from './auth.js';

const router = express.Router();

export let initialChartData = [
  {
    year: 2007,
    type: 'First',
    value: 19,
  },
  {
    year: 2007,
    type: 'Second',
    value: 99,
  },
  {
    year: 2009,
    type: 'First',
    value: 87,
  },
  {
    year: 2008,
    type: 'Second',
    value: 78,
  },
  {
    year: 2014,
    type: 'First',
    value: 190,
  },
  {
    year: 2014,
    type: 'Second',
    value: 19,
  },
  {
    year: 2013,
    type: 'First',
    value: 177,
  },
  {
    year: 2013,
    type: 'Second',
    value: 192,
  },
];

export const startLastYear = Math.max(...initialChartData.map((el) => el.year));

export const lastYears = {
  first: startLastYear,
  second: startLastYear,
};

router.get('/', commonTaskTokenCheck, (req, res) => {
  if (initialChartData.length > 50) {
    lastYears.first = startLastYear;
    lastYears.second = startLastYear;

    initialChartData = initialChartData.filter(
      (event) => event.year <= startLastYear,
    );
  }

  res.json(initialChartData);
});

export { router as chartDataRouter };
