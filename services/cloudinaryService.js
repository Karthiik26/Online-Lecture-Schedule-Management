const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "admin-profiles",
    });
    fs.unlinkSync(filePath);
    return result;
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    throw err;
  }
};

module.exports = uploadImage;
