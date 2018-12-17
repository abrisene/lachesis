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

/**
 * Async Lachesis initialization function.
 * @param {boolean} useServer   Should Lachesis instantiate it's own server?
 * @param {number}  port        The server's port.
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

/**
 * Creates a client controller for lachesis, which can be used to create / update / delete timers.
 * @param {string} timerUrl       The url of the timer server.
 * @param {string} callbackUrl    The default callback url for expired timers.
 */
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
