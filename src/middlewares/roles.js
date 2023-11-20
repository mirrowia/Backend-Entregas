// Check if user is Admin
function isAdmin(req, res, next) {

    if (req.user && req.user.rol === 'admin') {
      // Si el usuario tiene el rol "Admin", permite que continúe con la solicitud
      next();
    } else {
      // Si el usuario no tiene el rol "Admin", devuelve un error de no autorizado
      return res.status(403).json({ error: 'Acceso no autorizado.' });
    }
}

  // Check if user is Premium or Above
function isPremium(req, res, next) {
  if (req.user && req.user.rol === 'premium' || req.user && req.user.rol === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Acceso no autorizado.' });
  }
}

  // Deny access if role is Admin
function denyAdmin(req, res, next) {
  if (req.user && req.user.rol === 'admin') return res.status(403).json({ error: 'This site is only for users' });
  
  next();
}
  
  
  module.exports = {isAdmin, isPremium, denyAdmin};