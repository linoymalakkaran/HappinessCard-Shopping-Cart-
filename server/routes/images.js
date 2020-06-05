const express = require('express'),
    path = require('path'),
	images = express.Router(),
	images_service = require('../services/images-service')
	;

images.get('/', (req, res) => {
	images_service.getImage(req, res);
});

module.exports = images;