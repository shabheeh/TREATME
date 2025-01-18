
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "../pages/user/LandingPage"
import LandingPageDoctor from "../pages/doctor/LandingPage";
import SignInFlow from "../pages/user/SignInFlow";
import SignUpFlow from "../pages/user/SignUpFlow";
import SignIn from "../components/admin/SignIn";
import LayoutAdmin from "../Layouts/admin/LayoutAdmin";
import Patients from "../pages/admin/Patients";
import Doctors from "../pages/admin/Doctors";
import Dashboard from "../pages/admin/Dashboard";
import LayoutUser from "../Layouts/user/LayoutUser";
import VisiitNow from "../components/user/VisitNow";




function AppRouter() {


  return (
     <Router>
      <Routes>
        <Route path="/" element={ <LandingPage />} />
        <Route path="/" element={ <LayoutUser />} >
          <Route path="/visitnow" element={ <VisiitNow /> } />
        </Route>
        <Route path="/signin" element={ <SignInFlow /> } />
        <Route path="/signup" element={ <SignUpFlow /> } />
        <Route path="/doctor-recruitement" element={ <LandingPageDoctor />} />  
        <Route path="/admin/signin" element={ <SignIn />} />
        <Route path="/admin" element={ <LayoutAdmin />} >
          <Route path="" element={ <Dashboard/>} />
          <Route path="/admin/patients" element={ <Patients/>} />
          <Route path="/admin/doctors" element={ <Doctors/> } />
        </Route>
      </Routes>
     </Router>
  )
}

export default AppRouter
