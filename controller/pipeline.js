const Prometheus = require('prom-client');

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

exports.monitor = function monitor(req, res, next){
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
}