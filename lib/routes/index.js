/*
 # routes/index.js
 # Routes Index
 */

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

const { cors, injectConfig } = require('./middleware.common');

const commonRoutes = require('./routes.common');

const config = require('../configs');


/*
 # Module Exports
 */

const routes = async () => {
  const environment = config.get('environment');
  const {
    app, appName, env, corsUrls,
  } = environment;

  const routeConfig = {
    title: appName,
    appName,
    env,
  };

  // Express Settings
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, '../views'));
  app.disable('x-powered-by');

  // Middleware Configs
  app.use(express.static('public'));

  app.use(logger('combined'));

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors(corsUrls));

  app.use(injectConfig('config', routeConfig));

  // API Middleware


  // Routes
  await commonRoutes();

  // 404 Handling
  app.use((req, res) => {
    res.status(404).json({ err: 404, message: `Could not find ${req.url}`});
  });
};

module.exports = routes;
