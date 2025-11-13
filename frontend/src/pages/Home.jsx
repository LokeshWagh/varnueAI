import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateUser } from "../redux/authSlice";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [user, setUser] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
    }
  }, [navigate]);

  // Logout is handled in Navbar component via Redux dispatch
  // const handleLogout = () => {
  //   dispatch(logout());
  //   localStorage.clear();
  //   navigate("/login");
  // };

  const openEditModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setUpdating(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = localStorage.getItem("token");
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}api/profile/${user.id}`;
      
      toast.info("Updating profile...", {
        position: "top-right",
        autoClose: 2000,
      });

      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        dispatch(
          updateUser({
            name: formData.name,
            email: formData.email,
          })
        );
        closeModal();
        toast.success("Profile updated successfully! ", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      } else {
        toast.error(data.message || "Failed to update profile", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    } catch (err) {
      toast.error(`Error updating profile: ${err.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main
        className="flex-1 flex flex-col items-center justify-center min-h-screen px-4"
        style={{
          background:
            "linear-gradient(45deg, #CDFFF1 0%, rgba(203, 245, 246, 0.73) 28.13%, rgba(240, 251, 224, 0.80) 79.75%, #F8FFDA 100%)",
        }}
      >
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Welcome to Your {user.role === "admin" ? "Admin" : "User"}{" "}
              Dashboard
            </h1>
            <div
              className={`inline-block px-6 py-3 rounded-full text-sm font-medium mt-4 ${
                user.role === "admin"
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              Role: {user.role.toUpperCase()}
            </div>
          </div>

          {/* Profile Box */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              <div className="flex-1 bg-white/30 backdrop-blur-md rounded-2xl shadow-xl p-6 lg:p-8 border border-white/40">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                  {/* Avatar */}
                  <div className="shrink-0">
                    <div className="w-24 h-24 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4 md:mb-0 shadow-md">
                    <span className="text-white text-2xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-left">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {user.name}
                  </h2>
                  <p className="text-gray-700 mb-1">
                    <strong className="text-gray-900">Email:</strong>{" "}
                    {user.email}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong className="role">Role:</strong> {user.role}
                  </p>
                  <p className="text-gray-700">
                    <strong className="user-id">User ID:</strong> {user.id}
                  </p>

                  {/* Buttons */}
                  <div className="mt-6 flex flex-wrap gap-4">
                    <button
                      onClick={openEditModal}
                      className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md shadow-sm bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Edit Profile
                    </button>
                    {user.role === "admin" && (
                      <Link
                        to="/alluser"
                        className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md shadow-sm bg-pink-500 text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 transition-colors"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-5a4 4 0 11-8 0 4 4 0 018 0zm8 4a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        See Users
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Edit Profile
                </h3>
              </div>

              <div className="px-6 py-6">
                <form onSubmit={handleUpdateProfile}>
                  <div className="space-y-4">
                    {/* Avatar */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-20 h-20 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-2xl font-bold">
                          {formData.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        required
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex gap-3 mt-6">
                    <button
                      type="submit"
                      disabled={updating}
                      className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                    >
                      {updating ? "Updating..." : "Update Profile"}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
