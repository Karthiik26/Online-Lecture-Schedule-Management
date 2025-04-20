const Adminschema = require("../models/admin");
const uploadImage = require("../config/cloudinary.js");
// const uploadImage = require("../services/cloudinaryService");
const getDataUri = require("../utils/datauri");
const { sendResponse } = require("../utils/responseHandler");

const createAdmin = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    if (!password || !username || !email || !role) {
      return sendResponse(res, 400, null, "Provide Complete Data");
    }

    const admin = new Adminschema({ username, email, password, role });

    let imageUrl = null;

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await uploadImage.uploader.upload(fileUri.content);
      admin.profileImage = cloudResponse?.secure_url;
    }

    await admin.save();
    sendResponse(res, 201, admin, "Login Successfull");
  } catch (error) {
    next(error);
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      sendResponse(res, 400, null, "Please Provide Complete Data");
    }
    const admin = await Adminschema.findOne({ email, role });
    if (!admin) {
      sendResponse(res, 404, null, "No Admin found");
    }
    const isPasswordMatched = await admin?.matchPassword(password);

    if (!isPasswordMatched) {
      return sendResponse(res, 400, "Invalid password");
    }

    const adminObj = admin.toObject?.() || admin;
    delete adminObj.password;
    sendResponse(res, 200, adminObj, "Login Successfull");
  } catch (error) {
    next(error);
  }
};

const getAdmins = async (req, res, next) => {
  try {
    const admins = await Adminschema.find();
    sendResponse(res, 200, admins, "Admins retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const getAdmin = async (req, res, next) => {
  try {
    const admin = await Adminschema.findById(req.params.id);
    if (!admin) {
      return sendResponse(res, 404, null, "Admin not found");
    }
    sendResponse(res, 200, admin, "Admin retrieved successfully");
  } catch (error) {
    next(error);
  }
};

const updateAdmin = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    const admin = await Adminschema.findById(req.params.id);
    if (!admin) {
      return sendResponse(res, 404, null, "Admin not found");
    }

    if (username) admin.username = username;
    if (email) admin.email = email;
    if (role) admin.role = role;

    if (req.file) {
      const uploadResult = await uploadImage(req.file.path);
      admin.profileImage = uploadResult.secure_url;
    }

    await admin.save();

    sendResponse(res, 200, admin, "Admin updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    const admin = await Adminschema.findByIdAndDelete(req.params.id);
    if (!admin) {
      return sendResponse(res, 404, null, "Admin not found");
    }
    sendResponse(res, 200, null, "Admin deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAdmin,
  getAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
};
