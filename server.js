'use strict';

//Load HTTP module
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const port = 3000;
const helmet = require('helmet');

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Init
const Prometheus = require('prom-client')
const pipelineDuration = new Prometheus.Histogram({
  name: 'pipeline_duration_seconds',
  help: 'Duration of pipeline in seconds',
  labelNames: ['project', 'branch'],
  // buckets for response time from 0.1ms to 500ms
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
})

const pipelineErrorCounter = new Prometheus.Counter({
    name: 'pipeline_error_counter',
    help: 'Counts pipeline that results in status error',
    labelNames: ['project', 'branch']
  })

const pipelineCounter = new Prometheus.Counter({
    name: 'pipeline_counter',
    help: 'Counts pipelines',
    labelNames: ['project', 'branch', 'status']
  }) 

//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, (err) => {
  if (err) {
	throw err;
  }
  console.log(`Server running on port ${port}`);
});

app.post('/', (req, res) => {
    // console.log(req.body.object_attributes.duration);
    // console.log(req.body.object_attributes.created_at);
    // console.log(req.body.object_attributes.finished_at);
    // console.log(req.body.object_attributes.ref);
    // console.log(req.body.object_attributes.status);
    // console.log(req.body.project.path_with_namespace);
    // console.log(req.body);
    
    const status = req.body.object_attributes.status;
    // possible status values are (running, pending, success, failed, canceled, skipped)
    if( status && ['failed', 'success'].includes(status) ){
        pipelineDuration
        .labels(req.body.project.path_with_namespace,req.body.object_attributes.ref)
        .observe(req.body.object_attributes.duration);

        pipelineCounter
            .labels(req.body.project.path_with_namespace,req.body.object_attributes.ref, req.body.object_attributes.status)
            .inc();    

        if("failed" === req.body.object_attributes.status){
            pipelineErrorCounter
                .labels(req.body.project.path_with_namespace,req.body.object_attributes.ref)
                .inc();
        }    
    }

	res.status(202);
	res.end();
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
    res.set('Content-Type', Prometheus.register.contentType)
    res.end(Prometheus.register.metrics())
  })