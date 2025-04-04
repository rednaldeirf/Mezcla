const isSignedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    res.redirect('/auth/sign-in');
  }
};

export default isSignedIn;