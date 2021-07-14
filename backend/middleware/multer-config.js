const multer = require('multer');

const MIME_TYPES = { //on genere les possibles extensions dimage
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({ //on enregistre les fichiers
    destination: (req, file, callback) => { //on lui donne la destination
        callback(null, 'images')
    },
    filename: (req, file, callback) => { //on lui donne le nom du fichier
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype]; //on lui donne lextension
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage : storage }).single('image');