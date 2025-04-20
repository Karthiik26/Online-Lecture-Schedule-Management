const express = require("express");
const { createMulterUpload } = require("../utils/createMulterUpload");

const {
  createInstructor,
  getInstructors,
  getInstructor,
  updateInstructor,
  deleteInstructor,
  loginInstructor,
} = require("../controllers/instructorController");

const router = express.Router();

router.post("/", createMulterUpload("profileImage"), createInstructor); 
router.post("/login", loginInstructor);
router.get("/", getInstructors); 
router.get("/:id", getInstructor);
router.put("/:id", createMulterUpload("profileImage"), updateInstructor);
router.delete("/:id", deleteInstructor);

module.exports = router;
