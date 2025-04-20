import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useLectureData from "../hooks/useLecture";
import useCourseData from "../hooks/useCourseData";
import useGetData from "../hooks/useGetData";

// Date Formatter
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}T${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

const Lectures = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isAttendModalOpen, setIsAttendModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    selectedCourse: "",
    selectedInstructor: "",
    startDateTime: "",
    duration: 0,
  });

  const { instructors, courses, lectures } = useSelector((state) => state.data);
  const {
    createLecture,
    getLectures,
    updateLecture,
    deleteLecture,
    loading,
    error,
    Sucesserror,
  } = useLectureData();
  const { getCourses } = useCourseData();
  const { getInstructors } = useGetData();
  const { user } = useSelector((state) => state.auth);

  // Load data on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        await Promise.all([getCourses(), getLectures(), getInstructors()]);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      }
    };
    fetchAll();
  }, []);

  const openModal = (lecture = null) => {
    setSelectedLecture(lecture);
    if (lecture) {
      setFormData({
        selectedCourse: lecture.course._id,
        selectedInstructor: lecture.instructor._id,
        startDateTime: formatDateTime(lecture.startDateTime),
        duration: lecture.duration,
      });
    } else {
      setFormData({
        selectedCourse: "",
        selectedInstructor: "",
        startDateTime: "",
        duration: 0,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLecture(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { selectedCourse, selectedInstructor, startDateTime, duration } =
      formData;

    const endDateTime = new Date(
      new Date(startDateTime).getTime() + duration * 60000
    );
    const course = courses.find((c) => c._id === selectedCourse);
    const instructor = instructors.find((i) => i._id === selectedInstructor);

    const lectureData = {
      courseId: selectedCourse,
      instructorId: selectedInstructor,
      courseName: course?.name,
      instructorName: instructor?.name,
      startDateTime,
      endDateTime,
      duration,
    };

    try {
      if (selectedLecture) {
        await updateLecture(selectedLecture._id, lectureData);
      } else {
        await createLecture(lectureData);
      }
    } catch (err) {
      console.error("❌ Error submitting lecture:", err);
    }
  };

  const handleDelete = async (lecture) => {
    try {
      await deleteLecture(lecture._id);
      alert(`${lecture.course?.name} lecture deleted successfully.`);
    } catch (err) {
      console.error("❌ Failed to delete lecture:", err);
    }
  };

  const openAttendModal = (lecture) => {
    setSelectedLecture(lecture);
    setIsAttendModalOpen(true);
  };

  const closeAttendModal = () => {
    setIsAttendModalOpen(false);
    setSelectedLecture(null);
  };

  const markAttendance = async (status) => {
    try {
      await updateLecture(selectedLecture._id, { attendanceStatus: status });
      alert("Attendance updated successfully.");
    } catch (err) {
      console.error("❌ Attendance update failed:", err);
    } finally {
      closeAttendModal();
    }
  };

  const isFormValid =
    formData.selectedCourse &&
    formData.selectedInstructor &&
    formData.startDateTime &&
    formData.duration > 0;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Lectures</h2>

      {user.role === "admin" && (
        <button
          onClick={() => openModal()}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Lecture
        </button>
      )}

      {/* Modal for Scheduling or Editing Lecture */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg w-full max-w-xl space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold">
              {selectedLecture ? "Edit Lecture" : "Schedule New Lecture"}
            </h3>
            <h4 className="text-red-800">{error && `error : ${error}`}</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Select Course</label>
                <select
                  name="selectedCourse"
                  className="w-full border p-2 rounded"
                  value={formData.selectedCourse}
                  onChange={handleInputChange}
                >
                  <option value="">Choose a course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Select Instructor
                </label>
                <select
                  name="selectedInstructor"
                  className="w-full border p-2 rounded"
                  value={formData.selectedInstructor}
                  onChange={handleInputChange}
                >
                  <option value="">Choose an instructor</option>
                  {instructors.map((inst) => (
                    <option key={inst._id} value={inst._id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Lecture Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="startDateTime"
                  className="w-full border p-2 rounded"
                  value={formData.startDateTime}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  min="1"
                  className="w-full border p-2 rounded"
                  value={formData.duration}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="loader">Loading.....</span> 
                  ) : selectedLecture ? (
                    "Update"
                  ) : (
                    "Schedule"
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-red-600 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {isAttendModalOpen && selectedLecture && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeAttendModal}
        >
          <div
            className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">
              Mark Attendance for:{" "}
              <span className="text-blue-600">
                {selectedLecture?.course?.name}
              </span>
            </h3>
            <p className="text-gray-700 mb-4">
              Instructor: {selectedLecture?.instructor?.name}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() =>
                  markAttendance(
                    selectedLecture.attendanceStatus === "Not Attended"
                      ? "Attended"
                      : "Not Attended"
                  )
                }
                className={`px-4 py-2 rounded text-white ${
                  selectedLecture.attendanceStatus === "Not Attended"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Mark as{" "}
                {selectedLecture.attendanceStatus === "Not Attended"
                  ? "Attended"
                  : "Not Attended"}
              </button>
              <button
                onClick={closeAttendModal}
                className="text-red-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lecture Table */}
      {lectures?.length > 0 ? (
        <div className="overflow-x-auto shadow-md rounded-lg mt-6">
          <table className="w-full bg-white text-sm">
            <thead className="bg-gray-100 text-left text-gray-700 font-medium">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Course</th>
                <th className="p-4">Instructor</th>
                <th className="p-4">Date</th>
                <th className="p-4">Start Time</th>
                <th className="p-4">End Time</th>
                {user.role !== "admin" && <th className="p-4">Attendance</th>}
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lectures.map((lecture, idx) => (
                <tr key={lecture._id} className="border-t">
                  <td className="p-4">{idx + 1}</td>
                  <td className="p-4">{lecture.course?.name}</td>
                  <td className="p-4">{lecture.instructor?.name}</td>
                  <td className="p-4">
                    {new Date(lecture.startDateTime).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {new Date(lecture.startDateTime).toLocaleTimeString()}
                  </td>
                  <td className="p-4">
                    {new Date(lecture.endDateTime).toLocaleTimeString()}
                  </td>
                  {user.role !== "admin" && (
                    <td className="p-4">
                      {lecture.attendanceStatus || "Not marked"}
                    </td>
                  )}
                  <td className="p-4 space-x-2">
                    {user.role === "admin" ? (
                      <>
                        <button
                          onClick={() => openModal(lecture)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(lecture)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => openAttendModal(lecture)}
                        className="text-blue-600 hover:underline"
                      >
                        Attend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 mt-4">No lectures scheduled yet.</p>
      )}
    </div>
  );
};

export default Lectures;
