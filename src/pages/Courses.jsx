import React, { useEffect, useState } from "react";
import useCourseData from "../hooks/useCourseData";
import { useSelector } from "react-redux";

const Courses = () => {
  const { getCourses, createCourse, updateCourse, deleteCourse, loading, error } =
    useCourseData();
  const courses = useSelector((state) => state.data.courses);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);

  const [newCourse, setNewCourse] = useState({
    name: "",
    level: "",
    description: "",
  });

  useEffect(() => {
    getCourses();
  }, []);

  const resetForm = () => {
    setNewCourse({ name: "", level: "", description: "" });
    setImageFile(null);
  };

  const openModal = (course = null) => {
    if (course) {
      setNewCourse({
        name: course.name,
        level: course.level,
        description: course.description,
      });
      setImageFile(null);
      setEditCourseId(course._id);
      setIsEditMode(true);
    } else {
      resetForm();
      setIsEditMode(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
    setIsEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newCourse.name);
    formData.append("level", newCourse.level);
    formData.append("description", newCourse.description);
    if (imageFile) formData.append("image", imageFile);

    setSubmitting(true);
    try {
      if (isEditMode) {
        await updateCourse(editCourseId, formData);
      } else {
        await createCourse(formData);
      }
      await getCourses();
      closeModal();
    } catch (err) {
      console.error("Error saving course:", err);
      alert("Failed to save course. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const HandleDelete = async (course) => {
    try {
      await deleteCourse(course._id);
      alert(`${course?.name} lecture deleted successfully.`);
    } catch (err) {
      console.error("❌ Failed to delete lecture:", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Courses</h2>

      <div className="mb-4">
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add Course
        </button>
      </div>

      {loading && <p>Loading courses...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && courses?.length === 0 && (
        <p className="text-gray-500">No courses available.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses?.map((course) => (
          <div
            key={course?._id}
            className="bg-white rounded-lg shadow p-4 space-y-2"
          >
            {course?.image && (
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-40 object-cover rounded"
              />
            )}
            <h3 className="text-lg font-semibold">{course?.name}</h3>
            <p className="text-sm text-gray-600">Level: {course?.level}</p>
            <p className="text-sm text-gray-700">{course?.description}</p>
            <button
              onClick={() => openModal(course)}
              className="text-blue-600 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => HandleDelete(course)}
              className="text-red-600 mx-20 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">
              {isEditMode ? "Edit Course" : "Add New Course"}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Course Name</label>
                <input
                  type="text"
                  name="name"
                  value={newCourse.name}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  placeholder="Enter course name"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Level</label>
                <select
                  name="level"
                  value={newCourse.level}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Select level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={newCourse.description}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  placeholder="Course description"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Course Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border rounded p-2 bg-gray-100"
                />
                {imageFile && (
                  <p className="text-xs text-gray-600 mt-1">
                    Selected: {imageFile.name}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`${
                    submitting
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white px-4 py-2 rounded`}
                >
                  {submitting
                    ? "Saving..."
                    : isEditMode
                    ? "Update Course"
                    : "Save Course"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-red-500 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
