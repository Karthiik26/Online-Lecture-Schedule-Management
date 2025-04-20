import { useDispatch } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { setUser } from "../redux/authSlice";
import { BACKEND_URI } from "../constants";
import { setLectures } from "../redux/dataSlice";

const useLogin = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password, role) => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = `${BACKEND_URI}/${
        role === "admin" ? "admins" : "instructors"
      }/login`;

      const response = await axios.post(endpoint, {
        email,
        password,
        role,
      });

      if (response.status === 200) {
        const userData = response.data?.data;

        dispatch(setUser(userData)); 
        localStorage.setItem("user", JSON.stringify(userData)); 
        return true; 
      } else {
        setError("Unexpected response from server");
        return false;
      }
    } catch (err) {
      const message = err.response?.data?.data || err.message || "Login failed";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;
