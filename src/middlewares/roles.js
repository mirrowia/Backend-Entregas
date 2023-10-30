// Check if user is Admin
function isAdmin(req, res, next) {
    if (req.user && req.user.rol === 'Admin') {
      // Si el usuario tiene el rol "Admin", permite que continúe con la solicitud
      next();
    } else {
      // Si el usuario no tiene el rol "Admin", devuelve un error de no autorizado
      return res.status(403).json({ error: 'Acceso no autorizado.' });
    }
  }

  // Deny access if role is Admin
function denyAdmin(req, res, next) {
  if (req.user && req.user.rol === 'Admin') return res.status(403).json({ error: 'This site is only for users' });
  
  next();
}
  
  
  module.exports = {isAdmin, denyAdmin};