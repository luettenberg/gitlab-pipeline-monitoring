const log4js = require('log4js');

log4js.configure({
  appenders: { 
    'gelf': { type: '@log4js-node/gelf', host: 'gelf.server', customFields: { 'system': 'dev-tools', 'application': 'gitlab-monitor' } },
    'console': { type: 'console', layout: { type: 'colored' } }
    },
  categories: {
       default: { appenders: ['console'], level: 'trace' } 
    }
});
 
const logger = log4js.getLogger();

logger.info('Log4Js configured');

module.exports = logger;