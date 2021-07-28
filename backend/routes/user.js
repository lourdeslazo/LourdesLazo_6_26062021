const express = require('express')
const router = express.Router()
const passwordSchema = require('../middleware/passwordVerify');
const userCtrl = require('../controllers/user')

//Le frontend envoie les informations de l'utilisateur 
router.post('/signup', passwordSchema, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router