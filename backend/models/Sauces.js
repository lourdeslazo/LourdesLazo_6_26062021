const mongoose = require('mongoose');

//Schema de donnes avec info du produit
const sauceSchema = mongoose.Schema({
  
  userId: { type: String, required: true },  
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true, default:0 },
  dislikes: { type: Number, required: true, default:0 },
  usersLiked: { type: [String] },
  usersDisliked: { type: [String] },
});

module.exports = mongoose.model('Sauces', sauceSchema);