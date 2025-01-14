
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "../pages/user/LandingPage"
import LandingPageDoctor from "../pages/doctor/LandingPage";
import SignInFlow from "../pages/user/SignInFlow";
import SignUpFlow from "../pages/user/SignUpFlow";
import SignIn from "../components/admin/SignIn";




function AppRouter() {


  return (
     <Router>
      <Routes>
        <Route path="/" element={ <LandingPage />} />
        <Route path="/signin" element={<SignInFlow />} />
        <Route path="/signup" element={<SignUpFlow />} />
        <Route path="/doctor" element={ <LandingPageDoctor />} />  
        <Route path="/admin/signin" element={ <SignIn />} />
      </Routes>
     </Router>
  )
}

export default AppRouter
