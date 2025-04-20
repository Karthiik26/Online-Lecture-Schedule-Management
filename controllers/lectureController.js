const Lecture = require("../models/lecture");
const Instructor = require("../models/instructor");
const Course = require("../models/course");
const { sendResponse } = require("../utils/responseHandler");

const hasScheduleConflict = async (instructorId, start, end) => {
  return await Lecture.findOne({
    instructor: instructorId,
    startDateTime: { $lt: end },
    endDateTime: { $gt: start },
  });
};

const createLecture = async (req, res, next) => {
  try {
    const {
      courseId,
      instructorId,
      startDateTime,
      duration,
      notes,
      attendanceStatus,
    } = req.body;

    console.log(
      "forData",
      courseId,
      instructorId,
      startDateTime,
      duration,
      notes,
      attendanceStatus
    );

    const [courseDoc, instructorDoc] = await Promise.all([
      Course.findById(courseId),
      Instructor.findById(instructorId),
    ]);

    if (!courseDoc || !instructorDoc) {
      return sendResponse(res, 400, null, "Invalid course or instructor ID");
    }

    const start = new Date(startDateTime);
    if (isNaN(start.getTime())) {
      return sendResponse(res, 400, null, "Invalid startDateTime format");
    }

    if (duration <= 0 || isNaN(duration)) {
      return sendResponse(res, 400, null, "Duration must be a positive number");
    }

    const end = new Date(start.getTime() + duration * 60000);

    const conflict = await hasScheduleConflict(instructorId, start, end);
    if (conflict) {
      return sendResponse(
        res,
        409,
        null,
        "Time conflict: Instructor has another lecture during this slot."
      );
    }

    const newLecture = new Lecture({
      course: courseId,
      instructor: instructorId,
      startDateTime: start,
      endDateTime: end,
      duration,
      notes,
      attendanceStatus,
    });

    await newLecture.save();

    courseDoc.lectures.push(newLecture._id);
    instructorDoc.lectures.push(newLecture._id);

    await Promise.all([courseDoc.save(), instructorDoc.save()]);

    return sendResponse(
      res,
      201,
      newLecture,
      "Lecture scheduled successfully and linked"
    );
  } catch (error) {
    next(error);
  }
};

const getLectures = async (req, res, next) => {
  try {
    const lectures = await Lecture.find()
      .populate("course")
      .populate("instructor");

    return sendResponse(res, 200, lectures, "All lectures retrieved");
  } catch (error) {
    next(error);
  }
};

const getLecture = async (req, res, next) => {
  try {
    const lecture = await Lecture.findById(req.params.id)
      .populate("course", "name")
      .populate("instructor", "name email");

    if (!lecture) {
      return sendResponse(res, 404, null, "Lecture not found");
    }

    return sendResponse(res, 200, lecture, "Lecture details retrieved");
  } catch (error) {
    next(error);
  }
};

const updateLecture = async (req, res, next) => {
  try {
    const {
      course,
      instructor,
      title,
      startDateTime,
      duration,
      notes,
      attendanceStatus,
    } = req.body;

    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
      return sendResponse(res, 404, null, "Lecture not found");
    }

    const [courseDoc, instructorDoc] = await Promise.all([
      Course.findById(course || lecture.course),
      Instructor.findById(instructor || lecture.instructor),
    ]);

    if (!courseDoc || !instructorDoc) {
      return sendResponse(res, 400, null, "Invalid course or instructor ID");
    }

    let start = new Date(startDateTime || lecture.startDateTime);
    if (isNaN(start.getTime())) {
      return sendResponse(res, 400, null, "Invalid startDateTime format");
    }

    if (duration && (duration <= 0 || isNaN(duration))) {
      return sendResponse(res, 400, null, "Duration must be a positive number");
    }

    const end = new Date(
      start.getTime() + (duration || lecture.duration) * 60000
    );

    const instructorLectures = await Lecture.find({
      instructor: instructor || lecture.instructor,
      _id: { $ne: lecture._id },
    }).select("startDateTime endDateTime");

    const conflict = instructorLectures.find((existingLecture) => {
      const existingStart = new Date(existingLecture.startDateTime);
      const existingEnd = new Date(existingLecture.endDateTime);

      return start < existingEnd && end > existingStart; 
    });

    if (conflict) {
      return sendResponse(
        res,
        409,
        null,
        "Time conflict: Instructor has another lecture during this slot."
      );
    }

    lecture.course = course || lecture.course;
    lecture.instructor = instructor || lecture.instructor;
    lecture.title = title || lecture.title;
    lecture.startDateTime = start;
    lecture.endDateTime = end;
    lecture.duration = duration || lecture.duration;
    lecture.notes = notes || lecture.notes;
    lecture.attendanceStatus = attendanceStatus || lecture.attendanceStatus;

    await lecture.save();

    return sendResponse(res, 200, lecture, "Lecture updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteLecture = async (req, res, next) => {
  try {
    const deletedLecture = await Lecture.findByIdAndDelete(req.params.id);

    if (!deletedLecture) {
      return sendResponse(res, 404, null, "Lecture not found");
    }

    return sendResponse(res, 200, null, "Lecture deleted successfully");
  } catch (error) {
    next(error);
  }
};

const SoftdeleteLecture = async (req, res, next) => {
  try {
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture || lecture.isDeleted) {
      return sendResponse(
        res,
        404,
        null,
        "Lecture not found or already deleted"
      );
    }

    lecture.isDeleted = true;
    await lecture.save();

    return sendResponse(res, 200, null, "Lecture soft-deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLecture,
  getLectures,
  getLecture,
  updateLecture,
  deleteLecture,
  SoftdeleteLecture,
};
