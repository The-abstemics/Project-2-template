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
	weight:  {
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
		type: [String],
		default: "https://cdn-icons.flaticon.com/png/512/2400/premium/2400780.png?token=exp=1645444792~hmac=579d203b709f95eba6fd43160e2d35ab"
		},
	favorite_drinks: []

});


const User = model('User', userSchema);

User.image = {
	normal: "https://cdn-icons.flaticon.com/png/512/6124/premium/6124471.png?token=exp=1645444792~hmac=a5b202b26d3c787b9415279f86edcae2",
	drunk: "https://nsdhrws",
	wasted: "https://gr5474os",
}

module.exports = User;