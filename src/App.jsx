import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./components/layout/Layout";
import Login from "./components/auth/Login";
import Home from "./pages/Home";
import Instructors from "./pages/Instructor";
import Courses from "./pages/Courses";
import Lecture from "./pages/Lecture";

function App() {
  const reduxUser = useSelector((state) => state.auth.user);

  const localUser = JSON.parse(localStorage.getItem("user"));

  const user = reduxUser || localUser;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route
          path="/dashboard"
          element={user ? <Layout /> : <Navigate to="/" />}
        >
          <Route index element={<Home />} />
          {user?.role === "admin" && (
            <>
              <Route path="instructors" element={<Instructors />} />
              <Route path="courses" element={<Courses />} />
            </>
          )}
          <Route path="lecture" element={<Lecture />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
