/*
 # index.js
 # Module Index
 */

/**
 # Module Dependencies
 */

const config = require('./configs');
const server = require('./server');

const models = require('./models');
const { TimerController, ClientController } = require('./controllers');

/**
 # Main
 */

const init = async (useServer = true, port) => {
  try {
    await config.init();
    if (useServer) await server(port);
    const timerController = new TimerController();
    config.add('controllers', { timer: timerController });

    return {
      timerController,
      config,
      models,
    };
  } catch (err) {
    console.error(err);
    return { err };
  }
};

const client = async ({ timerUrl, callbackUrl }) => {
  try {
    if (!timerUrl) throw new Error('Timer url not defined.');
    return new ClientController({ timerUrl, callbackUrl });
  } catch (err) {
    return err;
  }
};

/**
 # Module Exports
 */

module.exports = {
  init,
  client,
  config,
  models,
};
