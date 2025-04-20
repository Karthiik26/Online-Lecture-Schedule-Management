const express = require("express");
const { createMulterUpload } = require("../utils/createMulterUpload");

const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const router = express.Router();

router.post("/courses", createMulterUpload("image"), createCourse);
router.get("/courses", getCourses);
router.get("/courses/:id", getCourse);
router.put("/courses/:id", createMulterUpload("image"), updateCourse); 
router.delete("/courses/:id", deleteCourse);

module.exports = router;
