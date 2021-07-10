const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, saucesCtrl.createObject);
router.post('/:id/like', auth, saucesCtrl.stateObject);
router.put('/:id', auth, multer, saucesCtrl.modifyObject);
router.delete('/:id', auth, saucesCtrl.deleteObject);
router.get('/:id', auth, saucesCtrl.getOneObject);
router.get('/', auth, saucesCtrl.getAllObjects);

module.exports = router;