/*
 # server.js
 # Server Index
 */

/**
 # Module Dependencies
 */

const chalk = require('chalk');
const ip = require('ip');

const routes = require('./routes');

const config = require('./configs');
const models = require('./models');

/*
 # Server
 */

const server = async (port) => {
  const environment = config.get('environment');
  const {
    app, appName, env,
  } = environment;
  const instance = app.listen(port || environment.port, async () => {
    // Server Info
    const address = `http://${ip.address()}:${port || environment.port}`;

    // Add Server and Sockets to Config
    config.add('environment', { server: instance });

    // Routes
    await routes();

    // Render Status Logs
    console.log(chalk.bold.underline.green(`\n${appName} Listening on ${port}:\n`));

    console.log(chalk.bold.underline.green('  Addresses:\n'));
    if (env === 'development') console.log(chalk.cyan.bold(`  • http://localhost:${port || environment.port}`));
    console.log(chalk.cyan.bold(`  • ${address}`));

    console.log(chalk.bold.underline.green('\n  Configs:\n'));
    Object.keys(config).forEach((configKey) => {
      console.log(chalk`  {cyan ${configKey}}`);
      Object.keys(config[configKey]).forEach((k) => {
        const color = config[configKey][k] !== undefined ? 'cyan.bold' : 'dim';
        if (k !== 'apiPublicKeys') console.log(chalk`    • {${color} ${k}}`);
      });
      console.log('\n');
    });

    console.log(chalk.bold.underline.green('\n  Models:\n'));
    Object.keys(models).forEach((key) => {
      console.log(chalk`    • {cyan.bold ${key}}`);
    });

    console.log('\n');
  });

  return instance;
};

/*
 # Module Exports
 */

module.exports = server;
