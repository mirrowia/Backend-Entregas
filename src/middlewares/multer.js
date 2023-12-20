const multer = require('multer');
const {decodedToken } = require("../utils");

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        const fieldFolder = file.fieldname
        let folder;
        if(fieldFolder == "profile_image"){
            folder = "profiles";
        } else if(fieldFolder == "product_image"){
            folder = "products";
        }else if(fieldFolder == "profileImage"){

        }
        
        cb(null, `src/upload/${folder}/`)
    },
    filename: (req, file, cb)=>{
        const token = req.cookies.userToken;
        const userId = decodedToken(token)._id;
        cb(null, `${userId}.png`)
    }
})

const upload = multer({storage})

module.exports = upload;