
const { asyncRoute } = require('./middleware.common');
const { TimerController } = require('../controllers');
const { Timer } = require('../models');

// const config = require('../configs');

/*
 # Module Exports
 */

const routes = async () => {
  // const environment = config.get('environment');
  // const { app } = environment;

  // >>>>>>>>>>>>>>>> INDEX ROUTE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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
