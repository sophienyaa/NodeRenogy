const logger = require('pino');
const cli = require('./cli');
const args = cli.args;

module.exports = logger(
  {
    prettyPrint: true,
    level: args.loglevel
  },
);
