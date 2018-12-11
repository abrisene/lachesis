/*
 # clear.collections.js
 # Script for Clearing Lachesis Collections
 */

/**
 # Module Dependencies
 */

const chalk = require('chalk');
const lachesis = require('../lib');

const { models } = lachesis;

/**
 # Main
 */

const main = async () => {
  try {
    await lachesis.init();

    if (process.env.NODE_ENV === 'development') {
      await models.Timer.remove({});

      console.log(chalk`{yellow Timer Collections Cleared}`);
    } else {
      throw new Error('Cannot clear collections in production.');
    }
  } catch (err) {
    console.error(err);
  }
};

main();
