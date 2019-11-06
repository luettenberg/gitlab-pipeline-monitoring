
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const log4js = require('log4js');
const logger = require('./logging');

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(log4js.connectLogger(logger, { 
    level: 'auto',
    format: (req, res, format) => format(`:remote-addr - ":method :url HTTP/:http-version" :status :content-length ":referrer"`)
 }));
app.use('/api', require('./route/pipeline-webhook'));
app.use('/metrics', require('./route/prometheus'));

module.exports = app;