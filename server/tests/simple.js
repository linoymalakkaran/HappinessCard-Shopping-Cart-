var path = require('path');
//console.log(__dirname.toString().substring(0,__dirname.toString().lastIndexOf(path.sep)));

let s = "select * from offers where title = 'Apple Music Code' and";
console.log((s.substring(s.lastIndexOf(' '))).trim());
console.log(s.substring(0, s.lastIndexOf(' ')));
