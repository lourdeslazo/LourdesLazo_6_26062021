const express = require('express');
const router = express.Router();
const userCtrl = require('../crontrollers/user');

//le frontend envoie les informations de lutilisateur 
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;