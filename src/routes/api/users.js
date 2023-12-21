const express = require("express");
const router = express.Router();
const {isAdmin} = require("../../middlewares/roles")
const { authToken } = require("../../utils");
const controller = require("../../controllers/users"); 
const {profiles, documents }= require("../../middlewares/multer")

router.get("/premium/:id", authToken, isAdmin, controller.premiumRole);
router.post("/:uid/profile", authToken, profiles.single('profile_image'), controller.setProfilePicture);
router.post("/:uid/documents", authToken, documents.array('documents', 3), controller.uploadDocuments);


module.exports = router;