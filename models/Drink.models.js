const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const drinkSchema = new Schema({
	name: { 
		type: String, 
		required: true 
	},
	description: {
		type: String,
		required: true,
		},
	origin: {
		type: String,
		required: true,
		},
	alcohol_content: {
		type: Number,
		required: true,
		},
	likes: Number,
	size: {
		type: Number,
		required: true,
		default: 33
	          }
});

const Drink = model('Drink', drinkSchema);

module.exports = Drink;