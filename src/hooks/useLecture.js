import { useState } from "react";
import axios from "axios";
import { BACKEND_URI } from "../constants";
import { setLectures } from "../redux/dataSlice";
import { useDispatch, useSelector } from "react-redux";

const useLectureData = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [Sucesserror, setSucessError] = useState(null);

  // Get all lectures
  const getLectures = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BACKEND_URI}/lectures`);
      const allLectures = response.data?.data;

      if (user.role === "instructor") {
        const instructorLectures = allLectures.filter(
          (lecture) => lecture.instructor._id === user._id
        );
        console.log("instructorLectures", instructorLectures);
        dispatch(setLectures(instructorLectures));
      } else {
        dispatch(setLectures(allLectures));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch lectures");
    } finally {
      setLoading(false);
    }
  };

  // Get a single lecture
  const getLecture = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BACKEND_URI}/lectures/${id}`);
      return response.data?.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch lecture");
    } finally {
      setLoading(false);
    }
  };

  const createLecture = async (lectureData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${BACKEND_URI}/lectures`,
        lectureData
      );
      console.log("lectureData", lectureData, "response", response);
      getLectures();

      return response.data;
    } catch (err) {
      console.log("error", err.response.data.message);

      setSucessError(err.response?.data?.success);
      setError(err.response?.data?.message || "Failed to create lecture");
    } finally {
      setLoading(false);
    }
  };

  // Update a lecture
  const updateLecture = async (id, lectureData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${BACKEND_URI}/lectures/${id}`,
        lectureData
      );

      if (response.data) {
        getLectures();
      }

      return response.data;
    } catch (err) {
      setSucessError(err.response?.data?.success);
      setError(err.response?.data?.message || "Failed to update lecture");
    } finally {
      setLoading(false);
    }
  };

  // Delete a lecture
  const deleteLecture = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`${BACKEND_URI}/lectures/${id}`);
      getLectures();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete lecture");
    } finally {
      setLoading(false);
    }
  };

  // Soft delete a lecture
  const softDeleteLecture = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${BACKEND_URI}/lecture/lectures/soft-delete/${id}`
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to soft delete lecture");
    } finally {
      setLoading(false);
    }
  };

  return {
    getLectures,
    getLecture,
    createLecture,
    updateLecture,
    deleteLecture,
    softDeleteLecture,
    loading,
    error,
    Sucesserror
  };
};

export default useLectureData;
