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
	likes: {type: Number,
		default: 0,
		},
	size: {
		type: Number,
		required: true,
		default: 33
	          },
	image:{
		type:String,
		default:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Birra_Moretti_Logo_2015.jpeg/640px-Birra_Moretti_Logo_2015.jpeg'
	},
	owner:{
		type:String,
	}
});

const Drink = model('Drink', drinkSchema);

module.exports = Drink;