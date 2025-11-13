import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TableSkeletonLoading from "../component/TableSkeletonLoading";

function Allusers() {
  const navigate = useNavigate();
  
  // Get auth data from Redux
  const { user: reduxUser, token: reduxToken, isAuthenticated } = useSelector((state) => state.auth);
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // State for Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState("");

  // State for Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Check authentication and role
  useEffect(() => {

    if (!isAuthenticated || !reduxToken || !reduxUser) {
      navigate("/login");
      return;
    }

    // Check if user is admin
    if (reduxUser.role !== "admin") {
      navigate("/");
      return;
    }
    
    // Fetch users from backend
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${reduxToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.message);
          if (data.message.includes("Admin access")) {
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate, isAuthenticated, reduxToken, reduxUser]);

  // Delete Modal Functions
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
    setDeleteError("");
    setDeleting(false);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setDeleting(true);
    setDeleteError("");

    try {
      toast.info("Deleting user...", {
        position: "top-right",
        autoClose: 2000,
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}api/users/${userToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${reduxToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Remove user from state
        setUsers(users.filter((u) => u.id !== userToDelete.id));
        
        toast.success(`✅ ${userToDelete.name} deleted successfully!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        closeDeleteModal();
      } else {
        toast.error(data.message || "Failed to delete user.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        setDeleteError(data.message || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Network error. Could not delete user.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      setDeleteError("Network error. Could not delete user.");
    } finally {
      setDeleting(false);
    }
  };

  // Edit Modal Functions
  const openEditModal = (user) => {
    setUserToEdit(user);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setUserToEdit(null);
    setEditError("");
    setEditing(false);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();

    if (!userToEdit) return;

    setEditing(true);
    setEditError("");

    try {
      toast.info("Updating user...", {
        position: "top-right",
        autoClose: 2000,
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}api/profile/${userToEdit.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${reduxToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: userToEdit.name,
            email: userToEdit.email,
            role: userToEdit.role,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update user in state
        setUsers(users.map((u) => (u.id === userToEdit.id ? data.user : u)));
        
        toast.success(`✅ ${userToEdit.name} updated successfully!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        closeEditModal();
      } else {
        toast.error(data.message || "Failed to update user", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        setEditError(data.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Edit error:", error);
      toast.error("Network error. Could not update user.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      setEditError("Network error. Could not update user.");
    } finally {
      setEditing(false);
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
        <TableSkeletonLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full mx-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
            Access Denied
          </h3>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header Section */}
            <div className="px-6 py-4 bg-gray-50 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    All Users Management
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Total Users:{" "}
                    <span className="font-medium">{users.length}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.length > 0 ? (
                    currentUsers.map((userItem, index) => (
                      <tr
                        key={userItem.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {userItem.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {userItem.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              userItem.role === "admin"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {userItem.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditModal(userItem)}
                              className="text-indigo-600 hover:text-indigo-900 text-xs flex items-center"
                            >
                              <svg
                                className="w-5 h-5 mr-1"
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
                              Edit
                            </button>
                            <button
                              onClick={() => openDeleteModal(userItem)}
                              className="text-red-600 hover:text-red-900 text-xs flex items-center"
                            >
                              <svg
                                className="w-5 h-5 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.742 21H5.258a2 2 0 01-1.742-2.858L3 14m8 7h2m4-10a3 3 0 00-3-3H9a3 3 0 00-3 3v2m0 0v2a3 3 0 00-3 3h-2a3 3 0 00-3-3H3m14 0h2a3 3 0 00-3-3h-2m0 0v2a3 3 0 00-3 3h-2"
                                />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-6 py-3 border-t">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-center sm:justify-start">
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {Math.max(
                        1,
                        Math.min(indexOfFirstUser + 1, users.length)
                      )}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastUser, users.length)}
                    </span>{" "}
                    of <span className="font-medium">{users.length}</span> users
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <div className="bg-white border border-gray-300 px-3 py-2 rounded">
                    <span className="text-sm font-medium text-gray-700">
                      {currentPage}
                    </span>
                  </div>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || !users.length}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete User
                </h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this user?
                </p>
              </div>
              <button
                onClick={closeDeleteModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-xs font-bold">
                    {userToDelete?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {userToDelete?.name}
                  </p>
                  <p className="text-sm text-gray-500">{userToDelete?.email}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                This action cannot be undone. This will permanently delete the
                user's account and all associated data.
              </p>

              {userToDelete?.role === "admin" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                  <p className="text-xs text-yellow-800">
                    ⚠️ Warning: This is an admin user. Deleting admin accounts
                    may affect system functionality.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              {deleteError && (
                <p className="text-xs text-red-600 mr-auto">{deleteError}</p>
              )}
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
              >
                {deleting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  "Delete User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
              <p className="text-sm text-gray-500">Update user information</p>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              <form onSubmit={handleEditUser}>
                <div className="space-y-4">
                  {/* User Avatar Preview */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl font-bold">
                        {userToEdit?.name.charAt(0).toUpperCase()}
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
                      value={userToEdit ? userToEdit.name : ""}
                      onChange={(e) =>
                        setUserToEdit({ ...userToEdit, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                      value={userToEdit ? userToEdit.email : ""}
                      onChange={(e) =>
                        setUserToEdit({ ...userToEdit, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* Role Field (Admin dropdown) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={userToEdit ? userToEdit.role : "user"}
                      onChange={(e) =>
                        setUserToEdit({ ...userToEdit, role: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                {editError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mt-4">
                    <p className="text-sm">{editError}</p>
                  </div>
                )}

                {/* Modal Footer */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={editing}
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                  >
                    {editing ? "Updating..." : "Update User"}
                  </button>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={editing}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Allusers;
