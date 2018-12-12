
const { asyncRoute } = require('./middleware.common');
const config = require('../configs');
// const { TimerController } = require('../controllers');
const { Timer } = require('../models');

// const config = require('../configs');

/*
 # Module Exports
 */

const routes = async () => {
  const environment = config.get('environment');
  const controllers = config.get('controllers');
  const { app } = environment;
  const timerController = controllers.timer;

  // >>>>>>>>>>>>>>>> INDEX ROUTE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  app.post('/', (req, res) => {
    const { body } = req;
    console.log(body.message);
  });

  app.post('/timer', asyncRoute(async (req, res, next) => {
    try {
      const { body } = req;
      const {
        startTS,
        endTS,
        duration,
        durationType,
        payload,
        callback,
      } = body;

      const timer = await timerController.createTimer({
        startTS: parseInt(startTS, 10),
        endTS: endTS !== undefined ? parseInt(endTS, 10) : undefined,
        duration: duration !== undefined ? parseInt(duration, 10) : undefined,
        durationType,
        payload,
        callback,
      });

      res.send(JSON.stringify(timer));
    } catch {
      res.status(400).send();
    }
  }));
  /* app.post('/timer', (req, res) => {
    const { body } = req;
    const { timeout, data, uri } = body;

    timerController.createTimer({
      timeout,
      data,
      uri,
    })
    // .then(timer => { console.log(timer); return timer })
    .then(timer => res.json(timer))
    .catch(err => res.json({err}));
  });

  app.get('/timer/:id', (req, res) => {
    const { params } = req;
    const { id } = params;
    console.log(params);

    Timer.findOne({ _id: id }, (err, timer) => {
      res.json(timer);
    });
  })

  app.delete('/timer/:id', (req, res) => {
    const { params } = req;
    const { id } = params;
    timerController.deleteTimer(id)
    .catch(err => res.json({err}));
  });

  app.put('/timer/:id', (req, res) => {
    const { body } = req;
    const { params } = req;
    const { id } = params;
  }); */

  // >>>>>>>>>>>>>>>> COMMON ROUTES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
};

module.exports = routes;
