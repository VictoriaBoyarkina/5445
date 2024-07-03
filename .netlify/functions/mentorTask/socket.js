import { Server } from 'socket.io';
import { initialChartData, lastYears } from './chartData.js';
import { randomNumberRange } from '../utils.js';

const timerDelay = 3000;

/**
 * @param {import('express').Express} app
 * @param {import('http').Server} httpServer
 */
export function initSocket(app, httpServer) {
  const io = new Server(httpServer, {
    path: '/commonTask/socket',
    cors: {
      allowedHeaders: '*',
      origin: '*',
    },
  });

  let firstInterval;
  let secondInterval;

  io.of('/first').on('connection', (socket) => {
    console.log('connect to FIRST data. ', socket.id);

    firstInterval = setInterval(() => {
      lastYears.first++;
      const nextData = {
        year: lastYears.first,
        type: 'First',
        value: randomNumberRange(10, 1000),
      };
      socket.emit('add-new-data', nextData);
      initialChartData.push(nextData);
    }, timerDelay);

    socket.on('disconnect', () => {
      console.log('disconnect firstInterval');
      clearInterval(firstInterval);
    });
  });

  io.of('/second').on('connection', (socket) => {
    console.log('connect to SECOND data. ', socket.id);

    secondInterval = setInterval(() => {
      lastYears.second++;
      const nextData = {
        year: lastYears.second,
        type: 'Second',
        value: randomNumberRange(10, 1000),
      };
      socket.emit('add-new-data', nextData);
      initialChartData.push(nextData);
    }, timerDelay);

    socket.on('disconnect', () => {
      console.log('disconnect secondInterval');
      clearInterval(secondInterval);
    });
  });
}
