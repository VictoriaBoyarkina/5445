import express from 'express';
import { commonTaskTokenCheck } from './auth.js';

const router = express.Router();

const templateString = `
Этот парень был из тех
Кто просто любит #{common.life}
Любит #{common.holidays} и громкий #{common.sounds.laughter},
#{common.roadDust} и ветра свист.
Он был везде и всегда своим
Влюблял в себя целый #{common.world}
И гнал свой Байк, а не лимузин
Таких друзей больше нет...

Ты летящий вдаль, вдаль #{names.angel},
Ты летящий вдаль, вдаль #{names.angel}!
Ты один только друг - друг на все времена
#{common.notMany} среди #{common.people}...
Ты летящий вдаль #{names.fullNameAngel}.

Под гитарный жесткий Рок
Который так любил
#{common.harley} он домчать нас мог
До #{common.people} и #{common.life} любых
Но он исчез и никто не знал
Куда теперь мчит его #{common.bike}
#{names.trump} нам сказал
Что он отправился в #{common.sounds.bar}!
`;

router.get('/string', commonTaskTokenCheck, (req, res) => {
  res.json({
    status: 'ok',
    templateString,
  });
});

router.get('/data', commonTaskTokenCheck, (req, res) => {
  res.json({
    status: 'ok',
    data: {
      common: {
        life: '♂dicks♂',
        holidays: '♂suction♂',
        roadDust: '♂fisting ass♂',
        world: '♂GYM♂',
        bike: '♂dick♂',
        notMany: '♂Boss of this gym♂',
        people: '♂slaves♂',
        harley: '♂fisting anal♂',
        sounds: {
          laughter: '♂OAH♂',
          bar: '♂BAAAAAAAAR♂',
        },
      },
      names: {
        angel: '♂Billy♂',
        fullNameAngel: '♂Herrigton Billy♂',
        tramp: '♂Van Darkholme♂',
      },
    },
  });
});

export { router as templateDataRouter };
