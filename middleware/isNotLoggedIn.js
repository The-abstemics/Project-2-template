function isNotLoggedIn(req, res, next) {
	if (req.session.currentUser) {
		res.redirect('/profile');
	} else {
		next();
	}
}

module.exports = isNotLoggedIn;
