const fs = require('fs'),
	path = require('path'),
	sqlite3 = require('sqlite3').verbose(),
	db = new sqlite3.Database(__dirname+path.sep+'offers.db')
	;


function insertRecord (row) {
	var stmt = db.prepare("INSERT INTO offers ('ID', 'TITLE', 'DETAILS', 'IMG') "+
			"VALUES (?, ?, ?, ?)");
	stmt.run(row.id, row.title, row.details, row.img);
	stmt.finalize();
}

function checkTable (resolve, reject) {
	db.serialize(() => {		  	
		db.each("SELECT * from offers", (err, row) => {
		}, (err, nrows) => {
			if (err) {
				reject();
			} else {
				if (nrows === 0) {
					resolve();
				} else {
					console.log("Data is already inserted");
				}
			}
		});
	});
}

function showRecords () {
	db.serialize(() => {		  	
		db.each("SELECT * from offers", (err, row) => {
			console.log(row.name);
		}, (err, nrows) => {
			if (err) {
				console.log(`Error occured while retreiving records: ${err}`); 
			} else {
				console.log(`Total number of rows: ${nrows}`);
			}
		});
	});
}

function insertRecords () {
	fs.readFile(__dirname+path.sep+'MOCK_DATA.json', (err, data) => {
		if (err) throw err;
		let records = JSON.parse(data);
		db.serialize(() => {

			records.forEach((record, index) => {
				if (index < records.length) {
					insertRecord(record);
				} else {
					db.close();
				}			
			});
		  	
		});
	});
}

function createTable (fn) {
	db.serialize(function() {
  		db.run(`CREATE TABLE offers (id number(4), title varchar(500), 
		  details text, img varchar(500), location varchar(1000), 
		  category varchar(100), valid_from varchar(50), 
		  valid_till varchar(50), likes integer(10), percent_off integer(3));`);
  		fn();
  	});
}

function checkAndInsert () {
	checkTable(() => {
		insertRecords();
	}, () => {
		createTable(insertRecords);
	});
}



checkAndInsert();
//showRecords();
