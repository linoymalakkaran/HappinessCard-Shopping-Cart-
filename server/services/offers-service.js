const config = require('config'),
	path = require('path'),
	_ = require('lodash'),
	sqlite3 = require('sqlite3').verbose(),
	images_service = require('./images-service'),
	dbPath = __dirname.toString().substring(0,__dirname.toString().lastIndexOf(path.sep))
		+path.sep+'db'+path.sep+config.get('db.name');
	;

function getQueryString (params) {
	let queryString = 'SELECT * from offers';
	if (params && !params.isEmpty) {
		queryString += ' where ';
		let condition = (params.allany && 
			(params.allany.toUpperCase() === 'ALL')) ? 'AND' : 'OR';
		if (params.id) {
			queryString += " id = '"+params.id+"' "+condition
		}
		if (params.title) {
			queryString += " title like '%"+params.title +"%' "+condition;	
		}
		if (params.details) {
			queryString += " details like '%"+params.details +"%' "+condition;
		}
		if (params.location) {
			queryString += " location like '%"+params.location +"%' "+condition;
		}
		if (params.category) {
			queryString += " category like '%"+params.category +"%' "+condition;
		}
		if ((queryString.substring(queryString.lastIndexOf(' '))).trim() === condition) {
			queryString = queryString.substring(0, queryString.lastIndexOf(' '));
		}
	}
	queryString += ' order by id desc ';
	return queryString;
}


function getOffers (params, cb) {
	let db = new sqlite3.Database(dbPath);
	let queryString = getQueryString(params);
	console.log(`Executing query: ${queryString}`);
	let offers = [];
	db.serialize(() => {		  	
		db.each(queryString, (err, row) => {
			offers.push(row);
		}, (err, nrows) => {
			nrows = (nrows === undefined) ? 0 : nrows;
			console.log(`Total number of rows: ${nrows}`);
			cb(offers);
		});
	});
}

function getQueryParams(req) {
	let params = {
		isEmpty: true
	};
	if (req.query) {
		if (req.query.id) {
			params.id = req.query.id;
			params.isEmpty = false;
		}
		if (req.query.title) {
			params.title = req.query.title;
			params.isEmpty = false;
		}
		if (req.query.details) {
			params.details = req.query.details;
			params.isEmpty = false;
		}
		if (req.query.location) {
			params.location = req.query.location;
			params.isEmpty = false;
		}		
		if (req.query.category) {
			params.category = req.query.category;
			params.isEmpty = false;
		}
		if (req.query.allany) {
			params.allany = req.query.allany;
		}
	}
	return params;
}

function sendResponse(res, data) {
	res.set('Content-Type', 'application/json');
	res.send(data);
}

const getOfferId = (function() {
	let currentOfferId = 0;
	let db = new sqlite3.Database(dbPath);
	db.serialize(() => {		  	
		db.each("SELECT count(id) as count from offers", (err, row) => {
			currentOfferId = +row.count;
		}, (err, nrows) => {
			if (err) {
				console.log(err);
			}
		});
	});
	return function() {
		currentOfferId += 1;
		return currentOfferId;
	}
})();

function insertOffer (offer) {
	let db = new sqlite3.Database(dbPath);
	var stmt = db.prepare("INSERT INTO offers (id, title, details, img , location , "
			+"category, valid_from, valid_till, percent_off ) "+
			"VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
	stmt.run(getOfferId(), offer.title, offer.details, offer.img, 
		offer.location, offer.category, offer.valid_from, offer.valid_till, 
			offer.percent_off);
	stmt.finalize();
	db.close();
}

function updateOffer (offer) {
	let db = new sqlite3.Database(dbPath);
	var stmt = db.prepare(`UPDATE offers set title = '${offer.title}' , details = '${offer.details}'
		 , img = '${offer.img}'  , location = '${offer.location}' , 
			 category = '${offer.category}' , valid_from = '${offer.valid_from}' 
			 , valid_till = '${offer.valid_till}' ,  percent_off = '${offer.percent_off}'
			 where id = '${offer.id}' `);
	stmt.run();
	stmt.finalize();
	db.close();
}

function deleteOffer (offerId) {
	let db = new sqlite3.Database(dbPath);
	var stmt = db.prepare("DELETE from offers where id = ?");
	stmt.run(offerId);
	stmt.finalize();
	db.close();
}

module.exports = {
	getOffers: function(req, res) {
		let params = getQueryParams(req);
		let cb = sendResponse.bind(null, res);
		getOffers(params, cb);
	},
	createOffer: function(req, res) {
		let offer = req.body;
		offer.img = req.file.originalname;
		insertOffer(offer);
		images_service.saveImage(req.file, (err) => {
			res.set('Content-Type', 'application/json');
			if (err) {
				res.send({"message":err.message});
			} else {
				res.send({"message":"success"});
			}
		});
	}, 

	updateOffer: function(req, res) {
		let offer = req.body;
		if (req.file) {
			offer.img = req.file.originalname;
			updateOffer(offer);	
			images_service.saveImage(req.file, (err) => {
				res.set('Content-Type', 'application/json');
				if (err) {
					res.send({"message":err.message});
				} else {
					res.send({"message":"success"});
				}
			});
		} else {
			updateOffer(offer);	
			res.send({"message":"success"});
		}			
	},

	deleteOffer: function(req, res) {
		let offers = JSON.parse(req.body.offers);
		for (let i=0; i < offers.length; i+=1) {
			let offer = offers[i];
			images_service.deleteImage(offer.img)
			deleteOffer(offer.id);
		}
		res.send({"message":"success"});
	}
}