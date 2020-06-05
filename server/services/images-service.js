const config = require('config'),
	path = require('path'),
    fs = require('fs'),
	_ = require('lodash'),
	sqlite3 = require('sqlite3').verbose(),
    images_folder = `${__dirname.toString().substring(0,__dirname.toString().lastIndexOf(path.sep))}`+
    `${path.sep}images${path.sep}offers${path.sep}`,
    Jimp = require("jimp")
	;

module.exports = {
    getImage: function (req, res) {
        let imageName = req.query.name,
            [width, height] = req.query.size.split('x')
            image = `${images_folder}${path.sep}${imageName}`
            ;

        Jimp.read(image, function (err, img) {
            if (err) {
                console.log(err);
                res.set('Content-Type', 'application/json');
                res.send({"message":err.message});
            } else {
                img.resize(+width, +height)
                .getBuffer(Jimp.AUTO, (err, buf) => {
                    if (err) {
                        console.log(err);
                        res.set('Content-Type', 'application/json');
                        res.send({"message":err.message});
                    } else {
                        res.set('Content-Type', Jimp.AUTO);
                        res.send(buf);
                    }                    
                });              
            }            
        });
    },

    saveImage: function (file, cb) {
        var tmp_path = file.path;
        var target_path = images_folder + file.originalname;
        fs.renameSync(tmp_path, target_path);
        cb();
    },

    deleteImage: function (fileName) {
        var target_path = images_folder + fileName;
        fs.unlinkSync(target_path);
    }
};