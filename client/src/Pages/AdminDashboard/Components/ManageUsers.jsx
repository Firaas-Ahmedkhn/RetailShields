import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";


// Custom toast
const Toast = ({ message, type }) => (
  <div className={`fixed top-5 right-5 px-4 py-2 rounded shadow-md z-50 text-white transition duration-300
    ${type === "success" ? "bg-green-500" : "bg-red-500"}`}>
    {message}
  </div>
);

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ role: "" });

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimeoutRef = useRef(null);

  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const usersPerPage = 8;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, debouncedSearch, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/auth/users", {
        params: {
          page: currentPage,
          limit: usersPerPage,
          search: debouncedSearch,
          role: roleFilter !== "all" ? roleFilter : undefined,
        },
      });
      setUsers(Array.isArray(res.data.users) ? res.data.users : []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching users", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/auth/${id}`);
      fetchUsers();
      showToast("User deleted successfully", "success");
    } catch (err) {
      console.error("Delete failed:", err.message);
      showToast("Failed to delete user", "error");
    }
  };

  const startEdit = (user) => {
    setEditingUserId(user._id);
    setEditForm({ role: user.role });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitEdit = async () => {
    try {
      await axios.put(`http://localhost:3000/api/auth/${editingUserId}`, editForm);
      setEditingUserId(null);
      fetchUsers();
      showToast("User updated successfully", "success");
    } catch (err) {
      console.error("Update failed:", err.message);
      showToast("Failed to update user", "error");
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setCurrentPage(1);
    }, 1000);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-6 relative">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Manage Users
      </h2>

      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded px-4 py-2"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="employee">Employee</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-md shadow">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="loader"></div>
          </div>
        ) : (
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">IP Address</th>
                <th className="px-6 py-3">Compliance Score</th>
                <th className="px-6 py-3">Risk Score</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                  {editingUserId === user._id ? (
                    <>
                      <td className="px-6 py-2 font-medium">{user.name}</td>
                      <td className="px-6 py-2">{user.email}</td>
                      <td className="px-6 py-2">{user.registeredIp}</td>
                      <td className="px-6 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium
      ${user.complianceScore < 60
                              ? 'bg-red-100 text-red-700'
                              : user.complianceScore < 80
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-700'
                            }`}
                        >
                          {user.complianceScore}
                        </span>
                      </td>

                      <td className="px-6 py-2">{user.riskScore}</td>
                      <td className="px-6 py-2">
                        <select
                          className="border rounded px-2 py-1 w-full"
                          value={editForm.role}
                          name="role"
                          onChange={handleEditChange}
                        >
                          <option value="admin">Admin</option>
                          <option value="employee">Employee</option>
                        </select>
                      </td>
                      <td className="px-6 py-2 flex gap-2">
                        <button
                          onClick={submitEdit}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded text-xs"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-2 font-medium flex flex-col">
                        <span>{user.name}</span>
                        <Link
                          to={`/employee-dashboard/${user._id}`}
                          className="text-blue-500 text-xs hover:underline mt-1"
                        >
                          View Dashboard
                        </Link>
                      </td>

                      <td className="px-6 py-2">{user.email}</td>
                      <td className="px-6 py-2">{user.registeredIp}</td>
                      <td className="px-6 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium
      ${user.complianceScore < 60
                              ? 'bg-red-100 text-red-700'
                              : user.complianceScore < 80
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-700'
                            }`}
                        >
                          {user.complianceScore}
                        </span>
                      </td>

                      <td className="px-6 py-2">{user.riskScore}</td>
                      <td className="px-6 py-2 capitalize font-semibold">
                        <span
                          className={`px-2 py-1 rounded text-xs ${user.role === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                            }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-2 flex items-center gap-3">
                        <FaEdit
                          onClick={() => startEdit(user)}
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        />
                        <FaTrash
                          onClick={() => handleDelete(user._id)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        />
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-3">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${currentPage === 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
            }`}
        >
          ⬅ Prev
        </button>
        <span className="px-4 py-2 text-gray-600 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${currentPage === totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
            }`}
        >
          Next ➡
        </button>
      </div>

      {/* Custom Loader CSS */}
      <style>{`
        .loader {
          border: 5px solid #f3f3f3;
          border-top: 5px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ManageUsers;
