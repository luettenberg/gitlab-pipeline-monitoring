var express = require("express");
var app = module.exports = express();  
const { check, validationResult } = require('express-validator');
const pipelineController = require('../controller/pipeline.js');
    
app.post('/pipeline-event', [
    check('object_kind').exists().equals("pipeline").withMessage("object kind must be of type pipeline"),
    check('object_attributes').exists().withMessage("object attributes must be set"),
    check('object_attributes.status').exists().withMessage("attribute status must be set"),
    check('project.path_with_namespace').exists().withMessage("project path with namespace must be set")
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    pipelineController.monitor(req,res);

	res.status(201);
	res.end();
});