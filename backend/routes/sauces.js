const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');


router.post('/', saucesCtrl.createObject);
router.put('/:id', saucesCtrl.modifyObject);
router.delete('/:id', saucesCtrl.deleteObject);
router.get('/:id', saucesCtrl.getOneObject);
router.get('/', saucesCtrl.getAllObjects);

module.exports = router;