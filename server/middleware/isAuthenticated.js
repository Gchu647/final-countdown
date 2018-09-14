module.exports = isAuthenticated;

function isAuthenticated (req, res, next) {
  let pathCheck = false;

  // checks if logged in user.id matches the params path id
  if(req.user) {
    pathCheck = (Number(req.user.id) === Number(req.params.id))
  }

  // Authentication successful if user is logged in and patchCheck is true
  if(req.isAuthenticated() && pathCheck) {
    next();
  }
  else {res.redirect('/404'); }
}