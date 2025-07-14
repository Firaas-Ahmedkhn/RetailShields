import Login from "./Pages/Authentication/Login";
import Register from "./Pages/Authentication/Register";
import DashboardLayout from "./Pages/EmployeeDashboard/DashboardLayout";
import POSSimulator from "./Pages/Components/PosSimulator";
import VendorLogForm from "./Pages/Components/VendorLogForm";
import ForgotPassword from "./Pages/Authentication/components/forgotPassword";
import SecurityQuestion from "./Pages/Authentication/components/securityQuestion";
import ResetPassword from "./Pages/Authentication/components/resetPassword";
import { BrowserRouter, Route, Routes } from "react-router-dom";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"Component={Login}/>
        <Route path="/register" Component={Register} />
         <Route path="/employee-dashboard" Component={DashboardLayout} />
         <Route path ="/possim" Component={POSSimulator}/>
         <Route path ="/vendorform" Component={VendorLogForm}/>
         <Route path ="/forgot-pass" Component={ForgotPassword}/>
         <Route path ="/security-question" Component={SecurityQuestion}/>
         <Route path ="/reset-password" Component={ResetPassword}/>
       

        
      </Routes>
    </BrowserRouter>
  )
}

export default App