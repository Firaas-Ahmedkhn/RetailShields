import Login from "./Pages/Authentication/Login";
import Register from "./Pages/Authentication/Register";
import DashboardLayout from "./Pages/EmployeeDashboard/DashboardLayout";
import POSSimulator from "./Pages/Components/PosSimulator";
import VendorLogForm from "./Pages/Components/VendorLogForm";
import ForgotPassword from "./Pages/Authentication/components/forgotPassword";
import SecurityQuestion from "./Pages/Authentication/components/securityQuestion";
import ResetPassword from "./Pages/Authentication/components/resetPassword";
import ProtectedRoute from "./Pages/Components/ProtectedRoute";
import AdminDashLayout from "./Pages/AdminDashboard/AdminDashLayout";
import NotAuthorized from "./Pages/Components/NotAuthorised";
import AdminRoute from "./Pages/Components/Adminonly";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-pass" element={<ForgotPassword />} />
        <Route path="/security-question" element={<SecurityQuestion />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/not-authorised" element={<NotAuthorized />} />


        {/* Protected Routes */}
        <Route
          path="/employee-dashboard/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminDashLayout />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/possim"
          element={
            <ProtectedRoute>
              <POSSimulator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendorform"
          element={
            <ProtectedRoute>
              <VendorLogForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
