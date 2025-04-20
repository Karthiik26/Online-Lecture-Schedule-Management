import { useDispatch } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { setUser } from "../redux/authSlice";
import { BACKEND_URI } from "../constants";
import useGetData from "./useGetData";

const useCreateData = () => {
  const dispatch = useDispatch();
  const { getInstructors } = useGetData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create Instructor
  const createInstructor = async (formData) => {
    console.log("email, password, role", formData);
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${BACKEND_URI}/instructors`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      getInstructors();
      console.log("Instructor created", response);
    } catch (err) {
      console.log("Instructor created Error", err);
      setError(err.response?.data?.data || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete Instructor
  const deleteInstructor = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`${BACKEND_URI}/instructors/${id}`);
      getInstructors();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete instructor");
    } finally {
      setLoading(false);
    }
  };

  // Update Instructor
  const updateInstructor = async (id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${BACKEND_URI}/instructors/${id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      getInstructors();
      console.log("Instructor updated", response);
      return response.data;
    } catch (err) {
      console.log("Update Instructor Error", err);
      setError(err.response?.data?.message || "Failed to update instructor");
    } finally {
      setLoading(false);
    }
  };

  return {
    createInstructor,
    deleteInstructor,
    updateInstructor,
    loading,
    error,
  };
};

export default useCreateData;