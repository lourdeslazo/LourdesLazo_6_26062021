const multer = require('multer');

const MIMES_TYPES = { //on genere les possibles extensions dimage
    'images/jpg': 'jpg',
    'images/jpeg': 'jpg',
    'images/png': 'png'
};

const storage = multer.diskStorage({ //on enregistre les fichiers
    destination: (req, file, callback) => { //on lui donne la destination
        callback(null, 'images')
    },
    filename: (req, file, callback) => { //on lui donne le nom du fichier
        const name = file.originalname.split(' ').join('_');
        const extension = MIMES_TYPES[file.mimetype]; //on lui donne lextension
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage : storage }).single('images');