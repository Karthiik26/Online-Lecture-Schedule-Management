const multer = require("multer");

const createMulterUpload = (fieldName = "file") => {
  const storage = multer.memoryStorage();
  return multer({ storage }).single(fieldName);
};

module.exports = { createMulterUpload }; 