const rateLimit = require('express-rate-limit');

//limite de requêtes

const limiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 250,

});

module.exports = limiter;