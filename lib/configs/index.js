/*
 # configs/index.js
 # Configuration Index
 */

/*
 # Module Dependencies
 */

require('dotenv').config();

const getEnvironment = require('./config.environment');
const getDatabase = require('./config.database');

/*
 # Methods
 */

class Config {
  async init() {
    this.environment = await getEnvironment();
    this.database = await getDatabase();
    this.controllers = {};
  }

  get(key) {
    return this[key] || undefined;
  }

  add(key, value) {
    if (this[key] !== undefined) {
      this[key] = { ...this[key], ...value };
    } else {
      this[key] = { ...value };
    }
  }
}

/*
 # Module Exports
 */

module.exports = new Config();
