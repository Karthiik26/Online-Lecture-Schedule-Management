import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";

const Sidebar = () => {
  // const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logOut = () => {
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/");
  };

  const navLinkStyle =
    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700";

  const activeStyle = "bg-blue-500 text-white";

  return (
    <aside className="w-64 h-full bg-white border-r shadow-md p-6">
      <h2 className="text-xl font-bold mb-8 text-blue-700">Dashboard</h2>
      <nav className="flex flex-col gap-2">
        {user?.role === "admin" ? (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive ? activeStyle : ""}`
              }
            >
              🏠 <span>Home</span>
            </NavLink>
            <NavLink
              to="/dashboard/instructors"
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive ? activeStyle : ""}`
              }
            >
              👨‍🏫 <span>Instructors</span>
            </NavLink>
            <NavLink
              to="/dashboard/courses"
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive ? activeStyle : ""}`
              }
            >
              📘 <span>Courses</span>
            </NavLink>
            <NavLink
              to="/dashboard/lecture"
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive ? activeStyle : ""}`
              }
            >
              📅 <span>Lectures</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive ? activeStyle : ""}`
              }
            >
              🏠 <span>Home</span>
            </NavLink>
            <NavLink
              to="/dashboard/lecture"
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive ? activeStyle : ""}`
              }
            >
              📅 <span>Lectures</span>
            </NavLink>
          </>
        )}
        <button type="button" className="mt-10" onClick={logOut}>
          ↩️ <span>Log Out</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
