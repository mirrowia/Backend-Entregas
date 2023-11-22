const sessionService = require("../services/session");

async function premiumRole(req, res) {
  let id = req.params.id;
  
  try {
    let user = await sessionService.getUserById(id);
    const oldRole = user.rol

    if (user.rol != "admin"){
        if(user.rol == "user"){
            user.rol = "premium"
        }else if( user.rol == "premium"){
            user.rol = "user"
        }
        sessionService.updateUser(id, user);
        return res.status(200).json({ message: `El rol del usuario: ${user.email} fue actualizado de ${oldRole} a ${user.rol} ` });
    }
    return res.status(200).json({ message: 'No se puede cambiar el rol a un administrador desde este endpoint.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
    premiumRole,
};
