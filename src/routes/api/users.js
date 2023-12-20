const express = require("express");
const router = express.Router();
const {isAdmin} = require("../../middlewares/roles")
const { authToken } = require("../../utils");
const controller = require("../../controllers/users"); 
const upload = require("../../middlewares/multer")

router.get("/premium/:id", authToken, isAdmin, controller.premiumRole);
router.post("/upload/profile", authToken, upload.single('profile_image'));
router.post("/upload/documents", authToken, upload.single('document_img'));


module.exports = router;