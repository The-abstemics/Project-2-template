const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
	username: {
		type: String,
		required: true, 
		unique: true
		},
	password: {
		type: String,
		required: true
		},
	age: {
		type: Number,
		required: true
		},
	sex: {
		type: String,
		required: true
	        },
	height:  {
		type: Number,
		required: true
		},
	weight: {
		type: Number,
		required: true
		},
	alcohol_lvl: {
		       type: Number,
		       },
	bac: {
			type:Number,
			default:0
			},
	image: { 	
		type: [],
		default: ["/images/start.jpg","/images/drink.jpg","/images/wasted.jpg"]
		},
		
	favorite_drinks: [],

	startDrinking:{	
		type:Number,
		default:0
	}

});


const User = model('User', userSchema);


module.exports = User;