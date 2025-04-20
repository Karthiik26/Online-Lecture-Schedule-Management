const express = require("express");
const {
  createLecture,
  getLectures,
  getLecture,
  updateLecture,
  deleteLecture,
  SoftdeleteLecture, 
} = require("../controllers/lectureController");

const router = express.Router();

router.post("/", createLecture);

router.get("/", getLectures);

router.get("/:id", getLecture);

router.put("/:id", updateLecture);

router.delete("/:id", deleteLecture);

router.patch("/soft-delete/:id", SoftdeleteLecture);

module.exports = router;
