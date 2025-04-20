const Course = require("../models/course");
const uploadImage = require("../config/cloudinary.js");
const getDataUri = require("../utils/datauri.js");
const { sendResponse } = require("../utils/responseHandler");

const createCourse = async (req, res, next) => {
  try {
    const { name, level, description, createdBy } = req.body;
    console.log("formData", name, level, description, createdBy);

    if (!name || !level || !description) {
      return sendResponse(res, 400, null, "Provide Complete Data");
    }

    let imageUrl = null;

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await uploadImage.uploader.upload(fileUri.content);
      imageUrl = cloudResponse?.secure_url;
    }

    const course = new Course({
      name,
      level,
      description,
      image: imageUrl,
      createdBy,
    });

    await course.save();
    sendResponse(res, 201, course, "Course created successfully");
  } catch (error) {
    next(error);
  }
};

const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find()
      .populate("createdBy")
      .populate("lectures");
    sendResponse(res, 200, courses, "Courses retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("createdBy")
      .populate("lectures");
    if (!course) {
      return sendResponse(res, 404, null, "Course not found");
    }
    sendResponse(res, 200, course, "Course retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { name, level, description, createdBy } = req.body;
    const updateData = { name, level, description, createdBy };

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await uploadImage.uploader.upload(fileUri.content);
      updateData.image = cloudResponse?.secure_url; 
    }

    const course = await Course.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!course) {
      return sendResponse(res, 404, null, "Course not found");
    }
    sendResponse(res, 200, course, "Course updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return sendResponse(res, 404, null, "Course not found");
    }
    sendResponse(res, 200, null, "Course deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
};
