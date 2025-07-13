import Login from "./Pages/Authentication/Login";
import Register from "./Pages/Authentication/Register";
import DashboardLayout from "./Pages/EmployeeDashboard/DashboardLayout";
import POSSimulator from "./Pages/Components/PosSimulator";
import VendorLogForm from "./Pages/Components/VendorLogForm";
import ForgotPassword from "./Pages/Authentication/components/forgotPassword";
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
       

        
      </Routes>
    </BrowserRouter>
  )
}

export default App