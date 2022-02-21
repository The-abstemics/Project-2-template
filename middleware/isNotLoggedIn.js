function isNotLoggedIn(req, res, next) {
	if (req.session.userId) {
		res.redirect('/profile');
	} else {
		next();
	}
}

module.exports = isNotLoggedIn;
