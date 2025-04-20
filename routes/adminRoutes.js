const express = require("express");
const { createMulterUpload } = require("../utils/createMulterUpload");

const {
  createAdmin,
  getAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
} = require("../controllers/adminController");

const router = express.Router();

router.post("/", createMulterUpload("profileImage"), createAdmin);
router.post("/login", loginAdmin);
router.get("/", getAdmins); 
router.get("/:id", getAdmin);
router.put("/:id", createMulterUpload("profileImage"), updateAdmin);
router.delete("/:id", deleteAdmin);

module.exports = router;
