import React from "react";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="w-full h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between px-6 shadow-lg">
      <h1 className="text-xl font-bold">Lecture Scheduler Admin</h1>

      {user && (
        <div className="flex items-center space-x-4">
          {/* Profile Image */}
          {(user.profileImage || user.image) && (
            <img
              src={user.profileImage || user.image}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border-2 border-white"
            />
          )}

          {/* User Name */}
          <span className="text-lg font-semibold capitalize">
            {user.username || user.name}
          </span>

          {/* User Role */}
          <span className="text-sm bg-blue-800 py-1 px-3 rounded-full capitalize">
            {user.role}
          </span>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
