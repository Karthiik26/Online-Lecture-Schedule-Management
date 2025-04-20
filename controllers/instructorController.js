const Instructor = require("../models/instructor");
const { sendResponse } = require("../utils/responseHandler");
const uploadImage = require("../config/cloudinary.js");
const getDataUri = require("../utils/datauri");

const createInstructor = async (req, res, next) => {
  try {
    const { name, email, password, role, isActive } = req.body;
    console.log("formData", name, email, password, role, isActive);

    if (!password || !name || !email) {
      return sendResponse(res, 400, null, "Provide Complete Data");
    }

    const fileUri = getDataUri(req?.file);
    const cloudResponse = await uploadImage.uploader.upload(fileUri.content);
    const instructor = new Instructor({
      name,
      email,
      password,
      role,
      isActive,
      profileImage: cloudResponse?.secure_url,
    });

    await instructor.save();
    sendResponse(res, 201, instructor, "Instructor created successfully");
  } catch (error) {
    next(error);
  }
};

const getInstructors = async (req, res, next) => {
  try {
    const instructors = await Instructor.find().populate("lectures");
    sendResponse(res, 200, instructors, "Instructors retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const getInstructor = async (req, res, next) => {
  try {
    const instructor = await Instructor.findById(req.params.id).populate(
      "lectures"
    );
    if (!instructor) {
      return sendResponse(res, 404, null, "Instructor not found");
    }
    sendResponse(res, 200, instructor, "Instructor retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const updateInstructor = async (req, res, next) => {
  try {
    const { name, email, password, role, isActive } = req.body;
    const updateData = { name, email, role, isActive };

    if (password) {
      updateData.password = password;
    }

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await uploadImage.uploader.upload(fileUri.content);
      updateData.profileImage = cloudResponse?.secure_url; 
    }

    const instructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );
    if (!instructor) {
      return sendResponse(res, 404, null, "Instructor not found");
    }
    sendResponse(res, 200, instructor, "Instructor updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteInstructor = async (req, res, next) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);
    if (!instructor) {
      return sendResponse(res, 404, null, "Instructor not found");
    }
    sendResponse(res, 200, null, "Instructor deleted successfully");
  } catch (error) {
    next(error);
  }
};

const loginInstructor = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return sendResponse(res, 400, null, "Please Provide Complete Data");
    }

    const instructor = await Instructor.findOne({ email, role }).populate({
      path: "lectures",
      populate: [
        {
          path: "course",
          select: "name",
        },
        {
          path: "instructor",
          select: "name",
        },
      ],
    });
    if (!instructor) {
      return sendResponse(res, 404, null, "No Instructor found");
    }

    const isPasswordMatched = await instructor.matchPassword(password);

    if (!isPasswordMatched) {
      return sendResponse(res, 400, null, "Invalid password");
    }

    const instructorObj = instructor.toObject();
    delete instructorObj.password; 
    sendResponse(res, 200, instructorObj, "Login Successful");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInstructor,
  getInstructors,
  getInstructor,
  updateInstructor,
  deleteInstructor,
  loginInstructor,
};
