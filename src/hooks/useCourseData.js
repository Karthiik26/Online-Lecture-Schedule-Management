import { useDispatch } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { setCourses } from "../redux/dataSlice";
import { BACKEND_URI } from "../constants";

const useCourseData = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all courses
  const getCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BACKEND_URI}/course/courses`);
      dispatch(setCourses(response.data?.data));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  // Create a new course
  const createCourse = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${BACKEND_URI}/course/courses`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  // Get a specific course
  const getCourse = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BACKEND_URI}/course/courses/${id}`);
      return response.data?.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch course");
    } finally {
      setLoading(false);
    }
  };

  // Update course
  const updateCourse = async (id, formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${BACKEND_URI}/course/courses/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  // Delete course
  const deleteCourse = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(
        `${BACKEND_URI}/course/courses/${id}`
      );
      getCourses();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete course");
    } finally {
      setLoading(false);
    }
  };

  return {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    loading,
    error,
  };
};

export default useCourseData;
