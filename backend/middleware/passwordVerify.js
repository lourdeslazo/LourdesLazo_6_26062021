const passwordSchema = require('../models/password');

//demande dun mot de passe fort
module.exports = (req, res, next) => {
    if(!passwordSchema.validate(req.body.password)){
        res.status(400).json({ error : ' le mot de passe nest pas assez fort : ' + passwordSchema.validate(req.body.password, {list : true})});
    }
    else{
        next();
    }
}