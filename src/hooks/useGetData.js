import { useDispatch } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { setInstuctors } from "../redux/dataSlice";
import { BACKEND_URI } from "../constants";

const useGetData = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getInstructors = async () => {

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BACKEND_URI}/instructors`);
      dispatch(setInstuctors(response.data?.data));
    } catch (err) {
      console.log("user login", err);
      setError(err.response?.data?.data || "Instructor Creation Failed");
    } finally {
      setLoading(false);
    }
  };

  return { getInstructors, loading, error };
};

export default useGetData;
