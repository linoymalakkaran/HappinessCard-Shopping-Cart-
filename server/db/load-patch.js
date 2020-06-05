fs = require('fs'),
	path = require('path'),
	sqlite3 = require('sqlite3').verbose(),
	db = new sqlite3.Database(__dirname+path.sep+'offers.db')
	;

let categories = [
"Travel",
"Fashion",
"Automotive",
"Food and Drink",
"Education and Learning",
"Liesure",
"Mind and Body",
"Services",
"Shopping",
"Tickets"
];

let locations = ["Dubai Mall", "Deira City Center", "Mirdif City Center", "Ibn Batuta Mall", "Emirates Mall"];

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

let arbitary_valid_from = '2017-05-01',
	range = 15,
	max_period = 30,
	min_period = 15
	;

function getOfferDates () {
	let _range = getRandomArbitrary(1, range);
	let _period = getRandomArbitrary(min_period, max_period);
	let valid_from = new Date(new Date(arbitary_valid_from).setDate(
			new Date(arbitary_valid_from).getDate()+_range)),
		valid_till = new Date(new Date(arbitary_valid_from).setDate(
			new Date(arbitary_valid_from).getDate()+_range+_period));
	return (
		{
			valid_from,
			valid_till
		}
	);
}

function updatePatch (rowId) {
	let randomLocation = locations[getRandomArbitrary(0, locations.length-1)];
	let randomCategory = categories[getRandomArbitrary(0, categories.length-1)];
	let valid_dates = getOfferDates();
	let likes = getRandomArbitrary(0,20);
	var stmt = db.prepare(`update offers set location = '${randomLocation}', 
		category = '${randomCategory}',
		valid_from = '${valid_dates.valid_from.toISOString().split('T')[0]}',
		valid_till = '${valid_dates.valid_till.toISOString().split('T')[0]}',
		likes = ${likes},
		percent_off = ${Math.ceil(getRandomArbitrary(0,80)/10) * 10} 
		where id = ${rowId}`);
	stmt.run();
	stmt.finalize();
}


function startUpdate () {
	db.serialize(() => {		  	
		db.each("SELECT * from offers", (err, row) => {
			updatePatch(row.id);
		}, (err, nrows) => {
			if (err) {
				console.log(`Error occured while retreiving records: ${err}`); 
			} else {
				console.log(`Total number of rows: ${nrows}`);
			}
		});
	});
}

startUpdate();