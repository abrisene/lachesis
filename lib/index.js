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
const { TimerController } = require('./controllers');

/**
 # Main
 */

const init = async (useServer = true) => {
  try {
    await config.init();
    if (useServer) await server();
    config.add('controllers', { timer: new TimerController() });

    return {
      config,
      models,
    };
  } catch (err) {
    console.error(err);
    return { err };
  }
};

/**
 # Module Exports
 */

module.exports = {
  init,
  config,
  models,
};
