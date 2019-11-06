const express = require("express");
const app = module.exports = express();  
const Prometheus = require('prom-client');

// Metrics endpoint
app.get('/',(req, res) => {
    res.set('Content-Type', Prometheus.register.contentType);
    res.end(Prometheus.register.metrics());
});