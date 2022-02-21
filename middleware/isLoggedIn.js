function isLoggedIn(req, res, next) {
	if (req.session) {
		next();
	} else {
		res.redirect('/auth/login');
	}
}

module.exports = isLoggedIn;
