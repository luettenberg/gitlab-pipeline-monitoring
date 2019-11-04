'use strict';

//Load HTTP module
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const Prometheus = require('prom-client')

const app = express();
const server = require('http').Server(app);
const port = 8080;

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', require('./route/pipeline-webhook'));

//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, (err) => {
  if (err) {
	throw err;
  }
  console.log(`Server running on port ${port}`);
});


// Metrics endpoint
app.get('/metrics', (req, res) => {
    res.set('Content-Type', Prometheus.register.contentType)
    res.end(Prometheus.register.metrics())
  })