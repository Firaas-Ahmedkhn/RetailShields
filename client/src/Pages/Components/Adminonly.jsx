// components/AdminRoute.jsx
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  if (!role) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500 font-semibold">
        Checking access...
      </div>
    );
  }

  if (role !== "admin") {
    return <Navigate to="/not-authorised" />;
  }

  return children;
};

export default AdminRoute;
