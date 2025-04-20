const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    startDateTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return !isNaN(new Date(v).getTime());
        },
        message: "Invalid startDateTime format",
      },
    },
    endDateTime: {
      type: Date,
    },
    duration: {
      type: Number,
      required: true,
      min: [1, "Duration must be at least 1 minute"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: "",
    },
    attendanceStatus: {
      type: String,
      enum: ["Attended", "Not Attended"],
      default: "Not Attended",
    },
  },
  {
    timestamps: true,
  }
);

lectureSchema.pre("save", function (next) {
  if (this.startDateTime && this.duration) {
    const start = new Date(this.startDateTime);

    if (isNaN(start.getTime())) {
      return next(new Error("Invalid startDateTime format"));
    }

    if (this.duration > 0) {
      const end = new Date(start.getTime() + this.duration * 60000); // duration in ms
      this.endDateTime = end;
    } else {
      return next(new Error("Duration must be a positive number"));
    }
  } else {
    return next(
      new Error(
        "startDateTime and duration are required to calculate endDateTime"
      )
    );
  }
  next();
});

lectureSchema.index(
  { instructor: 1, startDateTime: 1, endDateTime: 1 },
  { unique: false }
);

const Lecture = mongoose.model("Lecture", lectureSchema);

module.exports = Lecture;
