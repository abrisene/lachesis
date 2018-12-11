/*
 # config.database.js
 # Database Config
 */

/**
 # Module Dependencies
 */

const chalk = require('chalk');

const redis = require('redis');
const mongoose = require('mongoose');

const { exists, jsonTryParse } = require('../common');

mongoose.Promise = global.Promise;

/**
 # Configuration Methods
 */

const getRedis = async () => {
  const {
    REDIS, REDIS_URL, REDISCLOUD_URL, NODE_ENV,
  } = process.env;
  let client;

  if (exists([REDIS, REDIS_URL, REDISCLOUD_URL])) {
    const rConfig = jsonTryParse(REDIS);
    let method;

    try {
      if (exists(rConfig) && exists(rConfig.url)) {
        client = redis.createClient(rConfig.url, { password: rConfig.password });
        method = 'Config URL';
      } else if (exists(REDISCLOUD_URL)) {
        client = redis.createClient(REDISCLOUD_URL, { no_ready_check: true });
        method = 'RedisCloud URL';
      } else if (exists(REDIS_URL)) {
        client = redis.createClient(REDIS_URL);
        method = 'URL';
      } else if (NODE_ENV === 'development') {
        client = redis.createClient();
        method = 'Local';
      }
    } catch (err) {
      console.error(err);
    }

    if (client) {
      client.on('ready', () => {
        console.log(chalk.green.bold(`>> Redis Connected to ${method} <<`));
      });
      client.on('error', (err) => {
        console.log(chalk.red(`>> Redis Error: ${err}`));
      });
    }
  }

  return client;
};

const getMongoDB = async () => {
  const { MONGODB, MONGODB_URL, MONGODB_URI } = process.env;
  let client;

  if (exists([MONGODB, MONGODB_URL, MONGODB_URI])) {
    const mConfig = jsonTryParse(MONGODB);
    let { url } = mConfig || {};
    let method;

    try {
      if (exists(mConfig) && exists(mConfig.url)) {
        method = 'Config URL';
      } else if (exists(MONGODB_URL)) {
        url = MONGODB_URL;
        method = 'URL';
      } else if (exists(MONGODB_URI)) {
        url = MONGODB_URI;
        method = 'URI';
      }

      if (exists(url)) {
        const password = url.split(':')[2].split('@')[0];
        const passwordEncoded = encodeURIComponent(password);
        const encodedURL = url.replace(password, passwordEncoded);

        client = mongoose.connection;
        await mongoose.connect(encodedURL, { useNewUrlParser: true });

        console.log(chalk.green.bold(`>> MongoDB Connected to ${method} <<`));
      }
    } catch (err) {
      console.error(err);
    }
  }

  return client;
};

const getConfig = async () => {
  const redisClient = await getRedis();
  const mongoClient = await getMongoDB();

  return {
    redis: redisClient,
    mongoDB: mongoClient,
  };
};

/**
 # Module Exports
 */

module.exports = getConfig;
