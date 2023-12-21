const sessionService = require("../services/session");
const { decodedToken } = require("../utils");
const path = require("path");

async function premiumRole(req, res) {
  let id = req.params.id;
  
  try {
    let user = await sessionService.getUserById(id);

    const oldRole = user.rol

    if (user.rol != "admin"){
        if(user.rol == "user"){
          if(user.documents == 0) return res.status(400).json({ message: `El usuario ${user.email} aun no proporcionó la documentación necesaria.` });
          
          const identificacion = user.documents.find(document => document.name === "Identificacion.pdf");
          if(!identificacion) return res.status(400).json({ message: `El usuario ${user.email} aun no proporcionó la documentación de Identificación.` });
          
          const domicilio = user.documents.find(document => document.name === "Comprobante_de_domicilio.pdf")
          if(!domicilio) return res.status(400).json({ message: `El usuario ${user.email} aun no proporcionó la documentación de Comprobante de domicilio.` });
          
          const estadoCuenta = user.documents.find(document => document.name === "Comprobante_de_estado_de_cuenta.pdf")
          if(!estadoCuenta) return res.status(400).json({ message: `El usuario ${user.email} aun no proporcionó la documentación de Comprobante de estado de cuenta.` });

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

async function setProfilePicture(req, res) {
  try {
    //VERIFY IF A FILE WAS UPLOADED
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo.' });
    }

    const file = req.file;

    // Puedes acceder a la ruta del archivo subido
    const filePath = file.path;

    // Puedes realizar acciones adicionales con el archivo según tus necesidades
    // ...

    // Devolver una respuesta adecuada
    return res.status(200).json({ message: 'Archivo subido con éxito.', filePath });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

async function uploadDocuments(req, res) {
  const token = req.cookies.userToken;
  const userToken = decodedToken(token);

  if (!token) res.redirect("./login");

  try {
    const files = req.files;

    // VERIFY THE AMOUNT OF FILES UPLEADES IS 3
    if (files.length == 0 || files.length > 3) return res.status(400).json({ error: 'No se proporcionó la cantidad correcta de archivos.' });

    let user = await sessionService.getUser(userToken.email)

    files.forEach(file => {
      if (file.originalname == "Identificacion.pdf" || file.originalname == "Comprobante_de_domicilio.pdf" || file.originalname == "Comprobante_de_estado_de_cuenta.pdf") {
        user.documents.push({
          name:file.originalname,
          reference: `src/uploads/documents/${user._id}/${file.originalname}`
        })
      } else{
        return res.status(400).json({ error: 'Nombre de archivo no válido.' });
      }
    });

    await sessionService.updateUser(user._id, user)

    return res.status(200).json({ message: 'Archivo subido con éxito.'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

module.exports = {
    premiumRole,
    setProfilePicture,
    uploadDocuments
};
