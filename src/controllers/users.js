const sessionService = require("../services/session");
const { decodedToken } = require("../utils");
const mailer = require("../config/nodemailer");
const { logger } = require("../config/nodemailer");

async function getUsers(req, res) {
  try {
    const users = await sessionService.getUsers();
    let userList = [];

    users.map((user) => {
      userList.push({
        nombre: `${user.name} ${user.lastname}`,
        corre: user.email,
        rol: user.rol,
      });
    });

    return res.json({ status: "success", payload: userList });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener los usuarios" });
  }
}

async function deleteInactiveUsers(req, res) {
  try {
    const users = await sessionService.getUsers();
    let userList = [];
    let dueDate = new Date();
    dueDate.setDate(new Date().getDate() - 2);
    users.map(async (user) => {
      if (user.last_connection < dueDate) {
        const email = {
          from: "andresisella@gmail.com",
          to: user.email,
          subject: "Account Update - E-Commerce account deleted",
          html: `<p>We're sorry to inform you that your account <b>${user.email}</b>has been deleted due to inactivity over the past two days.</p> <p>Best regards.</p>`,
        };

        await sessionService.deleteUser(user.id)

        mailer.sendMail(email, (error, info) => {
          if (error) return console.error(error);

          logger.info("Correo enviado: " + info.response);
        });
        
      }
    });
    return res.json({ status: "success"});
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al eliminar usuarios inactivos",
    });
  }
}

async function updateUser(req, res){
  const user = req.body;
  const {uid} = req.params

  try {
    const dbUser = await sessionService.getUserById(uid)

    if(user.name != dbUser.name) dbUser.name = user.name
    if(user.lastname != dbUser.lastname) dbUser.lastname = user.lastname
    if(user.email != dbUser.email) dbUser.email = user.email
    if(user.age != dbUser.age) dbUser.age = user.age
    if(user.rol != dbUser.rol){
      try {
        req.params.id = uid
        const response = await premiumRole(req, res)

        if(response.statusCode == 400) return res.status(400).json({
          message: `El usuario ${user.email} aun no proporcionó la documentación necesaria.`,
        });
        dbUser.rol = user.rol
      } catch (error) {
        logger.error(error)
      }
    }
    await sessionService.updateUser(uid, dbUser)
    res.status(200).json({
      message: `El usuario ${dbUser.email} fue actualizado.`,
    });
  } catch (error) {
    logger.error(error)
  }
}

async function deleteUser(req, res){
  const {uid} = req.params
  try {
    const user = await sessionService.deleteUser(uid);
    return res
        .status(200)
        .json({ message: "Usuario eliminado correctamente." });
  } catch (error) {
    return res
        .status(500)
        .json({ error: `No se pudo eliminar el usuario. ${error}` });
  }

}

async function premiumRole(req, res) {
  let id = req.params.id;

  try {
    let user = await sessionService.getUserById(id);

    const oldRole = user.rol;

    if (user.rol != "admin") {
      if (user.rol == "user") {
        if (user.documents == 0)
          return res.status(400).json({
            message: `El usuario ${user.email} aun no proporcionó la documentación necesaria.`,
          });

        const identificacion = user.documents.find(
          (document) => document.name === "Identificacion.pdf"
        );
        if (!identificacion)
          return res.status(400).json({
            message: `El usuario ${user.email} aun no proporcionó la documentación de Identificación.`,
          });

        const domicilio = user.documents.find(
          (document) => document.name === "Comprobante_de_domicilio.pdf"
        );
        if (!domicilio)
          return res.status(400).json({
            message: `El usuario ${user.email} aun no proporcionó la documentación de Comprobante de domicilio.`,
          });

        const estadoCuenta = user.documents.find(
          (document) => document.name === "Comprobante_de_estado_de_cuenta.pdf"
        );
        if (!estadoCuenta)
          return res.status(400).json({
            message: `El usuario ${user.email} aun no proporcionó la documentación de Comprobante de estado de cuenta.`,
          });

        user.rol = "premium";
      } else if (user.rol == "premium") {
        user.rol = "user";
      }
      sessionService.updateUser(id, user);

      return res.status(200).json({
        message: `El rol del usuario: ${user.email} fue actualizado de ${oldRole} a ${user.rol} `,
      });

    }
    return res.status(200).json({
      message:
        "No se puede cambiar el rol a un administrador desde este endpoint.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function setProfilePicture(req, res) {
  const token = req.cookies.userToken;
  const userToken = decodedToken(token);
  try {
    //VERIFY IF A FILE WAS UPLOADED
    if (!req.file) {return res.status(400).json({ error: "No se proporcionó ningún archivo." })}

    const file = req.file;
    const filePath = file.path;

    let user = await sessionService.getUser(userToken.email);

    user.picture = `/profiles/${user._id}/profile.jpeg`

    await sessionService.updateUser(user._id, user)

    return res
      .status(200)
      .json({ message: "Archivo subido con éxito.", filePath });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
}

async function uploadDocuments(req, res) {
  const token = req.cookies.userToken;
  const userToken = decodedToken(token);

  if (!token) res.redirect("./login");

  try {
    const files = req.files;

    // VERIFY THE AMOUNT OF FILES UPLEADES IS 3
    if (files.length == 0 || files.length > 3)
      return res
        .status(400)
        .json({ error: "No se proporcionó la cantidad correcta de archivos." });

    let user = await sessionService.getUser(userToken.email);

    files.forEach((file) => {
      if (
        file.originalname == "Identificacion.pdf" ||
        file.originalname == "Comprobante_de_domicilio.pdf" ||
        file.originalname == "Comprobante_de_estado_de_cuenta.pdf"
      ) {
        user.documents.push({
          name: file.originalname,
          reference: `src/uploads/documents/${user._id}/${file.originalname}`,
        });
      } else {
        return res.status(400).json({ error: "Nombre de archivo no válido." });
      }
    });

    await sessionService.updateUser(user._id, user);

    return res.status(200).json({ message: "Archivo subido con éxito. Favor de regresar a la pagina anterior y recargar." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
}

module.exports = {
  getUsers,
  deleteInactiveUsers,
  updateUser,
  deleteUser,
  premiumRole,
  setProfilePicture,
  uploadDocuments,
};
