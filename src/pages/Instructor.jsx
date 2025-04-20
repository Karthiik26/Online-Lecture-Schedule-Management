import React, { useEffect, useState } from "react";
import useGetData from "../hooks/useGetData";
import { useSelector } from "react-redux";
import useCreateData from "../hooks/useCreateData";

const Instructors = () => {
  const { getInstructors } = useGetData();
  const { instructors } = useSelector((state) => state.data);
  const { createInstructor, updateInstructor , deleteInstructor} = useCreateData();
  const userAvatar =
    "https://imgs.search.brave.com/GTciTfNisqdPU0yVTnpyoDolBSpKYl9K6y6H7BOjDlg/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRpYS5nZXR0eWltYWdlcy5jb20vaWQvMjAx/MzkxNTc2NC9waG90by91c2VyLWljb24taW4tZmxhdC1zdHlsZS5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9UEotMnZvUWZh/Q3hhZUNsdzZYYlVz/QkNaT3NTTjlIVWVC/SUg1Qk82VmRScz0";

  useEffect(() => {
    getInstructors();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const [newInstructor, setNewInstructor] = useState({
    name: "",
    email: "",
    profileImage: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editInstructorId, setEditInstructorId] = useState(null);

  const openModal = (instructor = null) => {
    if (instructor) {
      setNewInstructor({
        name: instructor.name,
        email: instructor.email,
        profileImage: instructor.profileImage,
      });
      setEditInstructorId(instructor._id);
      setIsEditMode(true);
    } else {
      setNewInstructor({ name: "", email: "", profileImage: "" });
      setProfileImage(null);
      setIsEditMode(false);
    }
    setIsModalOpen(true);
  };

  // close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // handle image upload change
  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  // handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInstructor((prevState) => ({ ...prevState, [name]: value }));
  };

  // handle form submission for adding or updating
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", newInstructor.name);
    formData.append("email", newInstructor.email);
    if (!isEditMode) {
      formData.append("password", "12345678");
    }

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    if (isEditMode) {
      await updateInstructor(editInstructorId, formData);
    } else {
      await createInstructor(formData);
    }

    getInstructors(); 
    setNewInstructor({ name: "", email: "" });
    setProfileImage(null);
    setIsEditMode(false);
    closeModal();
  };

  const HandleDleteInstructor = async (instructor) => {
    try {
      await deleteInstructor(instructor._id);
      alert(`${instructor?.name} lecture deleted successfully.`);
    } catch (err) {
      console.error("❌ Failed to delete lecture:", err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Instructors</h2>

      <div className="mb-4">
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add Instructor
        </button>
      </div>

      {/* Table displaying instructors */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-gray-100 text-left text-gray-600">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructors?.map((instructor, i) => (
              <tr key={instructor._id}>
                <td className="p-4">{i + 1}</td>
                <td className="p-4">
                  <img
                    src={instructor?.profileImage || userAvatar}
                    width={60}
                    height={60}
                    alt="user"
                  />
                </td>
                <td className="p-4">{instructor.name}</td>
                <td className="p-4">{instructor.email}</td>
                <td className="p-4">
                  <button
                    className="text-blue-600 hover:underline mr-2"
                    onClick={() => openModal(instructor)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => HandleDleteInstructor(instructor)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-500 opacity-95 flex justify-center items-center z-50"
          onClick={closeModal} 
        >
          <div
            className="bg-white shadow-md rounded-lg p-6 space-y-4 max-w-xl w-full relative"
            onClick={(e) => e.stopPropagation()} 
          >
            <h3 className="text-xl font-semibold mb-4">
              {isEditMode ? "Edit Instructor" : "Add New Instructor"}
            </h3>

            {/* Form inside the modal */}
            <form onSubmit={handleFormSubmit}>
              <div>
                <label className="block font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newInstructor.name}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  placeholder="Instructor's name"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newInstructor.email}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  placeholder="Instructor's email"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Instructor Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border rounded p-2 bg-gray-100"
                />
                {profileImage && (
                  <p className="text-xs text-gray-600 mt-1">
                    Selected: {profileImage.name}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {isEditMode ? "Update Instructor" : "Add Instructor"}
              </button>
            </form>

            <button
              onClick={closeModal}
              className="mt-4 text-red-600 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Instructors;
