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
	image: {
		type: [String], 
		default: "https://cdn-icons.flaticon.com/png/512/560/premium/560277.png?token=exp=1645444021~hmac=0c3cbf5bef3347e4cff1fa2257ceee02"
		},
	alcohol_lvl: {
		       type: Number,
		       },
	consumptions: { 
			type: Schema.Types.ObjectId, 
			ref: "Drink"
			}
});

const User = model('User', userSchema);

module.exports = User;