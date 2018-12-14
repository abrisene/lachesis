
const mongoose = require('mongoose');
const config = require('../configs');
const { asyncRoute } = require('./middleware.common');
const { Timer } = require('../models');

/*
 # Module Exports
 */

const routes = async () => {
  const environment = config.get('environment');
  const controllers = config.get('controllers');
  const { app, env } = environment;
  const timerController = controllers.timer;

  // >>>>>>>>>>>>>>>> MIDDLEWARE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  app.use('/timer/:id', asyncRoute(async (req, res, next) => {
    try {
      const { params } = req;
      const { id } = params;
      req.params_id = mongoose.Types.ObjectId(id);
      next();
    } catch (err) {
      res.status(404).json({ err: err.message });
    }
  }));

  // >>>>>>>>>>>>>>>> INDEX ROUTE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  if (env !== 'production') {
    app.post('/', (req, res) => {
      const { body } = req;
      console.log(body);
    });
  }

  app.get('/timer/:id', asyncRoute(async (req, res, next) => {
    try {
      const { params } = req;
      const { _id } = params;
      const timer = await Timer.findOne(_id);
      res.json(timer);
    } catch (err) {
      res.status(404).json({ err: err.message });
    }
  }));

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
        startTS: startTS !== undefined ? parseInt(startTS, 10) : undefined,
        endTS: endTS !== undefined ? parseInt(endTS, 10) : undefined,
        duration: duration !== undefined ? parseInt(duration, 10) : undefined,
        durationType,
        payload: payload !== undefined ? JSON.parse(payload) : undefined,
        callback,
      });

      res.json(timer);
    } catch (err) {
      res.status(400).json({ err: err.message });
    }
  }));

  app.patch('/timer/:id', asyncRoute(async (req, res, next) => {
    try {
      const { params } = req;
      const { id } = params;
      const { body } = req;
      const {
        startTS,
        endTS,
        adjust,
        duration,
        durationType,
        payload,
        callback,
      } = body;

      const timer = await timerController.updateTimer({
        id,
        startTS: startTS !== undefined ? parseInt(startTS, 10) : undefined,
        endTS: endTS !== undefined ? parseInt(endTS, 10) : undefined,
        adjust: adjust !== undefined ? parseInt(adjust, 10) : undefined,
        duration: duration !== undefined ? parseInt(duration, 10) : undefined,
        durationType,
        payload: payload !== undefined ? JSON.parse(payload) : undefined,
        callback,
      });

      res.json(timer);
    } catch (err) {
      res.status(400).json({ err: err.message });
    }
  }));

  app.delete('/timer/:id', asyncRoute(async (req, res, next) => {
    try {
      const { params } = req;
      const { id } = params;
      const result = await timerController.deleteTimer(id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ err: err.message });
    }
  }));

  // >>>>>>>>>>>>>>>> COMMON ROUTES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
};

module.exports = routes;
