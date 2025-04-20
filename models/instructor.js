const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const InstructorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, default: "12345678" },
    isActive: { type: Boolean, default: true },
    profileImage: { type: String, required: true },
    role: { type: String, enum: ["instructor"], default: "instructor" },
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    isDelete: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

InstructorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

InstructorSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await mongoose.model("Lecture").deleteMany({ instructor: this._id });
    next();
  }
);

InstructorSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Instructor", InstructorSchema);
