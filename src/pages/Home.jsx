import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useGetData from "../hooks/useGetData";

const Home = () => {
  const { getInstructors } = useGetData();
  const { instructors, courses, lectures } = useSelector((state) => state.data);

  const totalCourses = courses?.length || 0;
  const totalInstructors = instructors?.length || 0;
  const totalLectures = lectures?.length || 0;

  useEffect(() => {
    getInstructors();
  }, [getInstructors]);

  const reduxUser = useSelector((state) => state.auth.user);

  const localUser = JSON.parse(localStorage.getItem("user"));

  const AdminUser =
    (reduxUser?.role === "admin" || localUser?.role === "admin") && (reduxUser || localUser);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
      {AdminUser ? (
        <>
          <p className="text-gray-700">
            Welcome to the Lecture Scheduling Admin Panel. You can manage instructors, schedule lectures, and more from here.
          </p>
          {/* Analytics Cards Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-6 rounded-xl shadow">
              📘 Total Courses: {totalCourses}
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              👨‍🏫 Instructors: {totalInstructors}
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              📅 Lectures Scheduled: {totalLectures}
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-700">
            Welcome to the Lecture Scheduling <b>Instructor</b> Panel.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-6 rounded-xl shadow">
              📅 Lectures Scheduled: {totalLectures}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
