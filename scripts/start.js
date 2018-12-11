/*
 # index.js
 # App Index
 */

/**
 # Module Dependencies
 */

const lachesis = require('../lib');
// const { config, models } = lachesis;

/**
 # Main
 */

const main = async () => {
  try {
    await lachesis.init();
  } catch (err) {
    console.error(err);
  }
};

main();
