const express = require('express'),
	app = express(),
	offers = require('./routes/offers'),
	images = require('./routes/images'),
	config = require('config')
	;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(config.get('context'), express.static('public'));
app.use(config.get('context')+'/offers', offers);
app.use(config.get('context')+'/images', images);


app.listen(config.get('port'), () => {
	console.log(`App running => localhost:${config.get('port')}${config.get('context')}`);
});

