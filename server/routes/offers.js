const express = require('express'),
    path = require('path'),
	offers = express.Router(),
	offers_service = require('../services/offers-service'),
    images_folder = `${__dirname.toString().substring(0,__dirname.toString().lastIndexOf(path.sep))}`+
    `${path.sep}images${path.sep}offers${path.sep}`,
    multer = require('multer'),
    upload = multer({dest: images_folder})
	;

offers.get('/', (req, res) => {
	offers_service.getOffers(req, res);
});

offers.post('/create', upload.single('offer-image'), (req, res) => {
    offers_service.createOffer(req, res);
});

offers.post('/update', upload.single('offer-image'), (req, res) => {
    offers_service.updateOffer(req, res);
});

offers.post('/delete', upload.single('offer-image'), (req, res) => {
    offers_service.deleteOffer(req, res);
});

module.exports = offers;