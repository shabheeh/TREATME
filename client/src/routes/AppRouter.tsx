import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { adminRoutes } from "./adminRoutes";
import { patientRoutes } from "./patientRoutes";
import { doctorRoutes } from "./doctorRoutes";
import FourNotFour from "../components/basics/404";
import Unauthorized from "../components/basics/401";
import VideoCall from "../components/basics/Consultation/VideoCall";
import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
  return (
    <Router>
      <Routes>
        // public routes
        <Route path="/401" element={<Unauthorized />} />
        // user routes
        {patientRoutes}
        {adminRoutes}
        {doctorRoutes}
        <Route
          path="/video-consultation"
          element={
            <ProtectedRoute allowedRoles={["patient", "doctor", "admin"]}>
              <VideoCall />
            </ProtectedRoute>
          }
        />
        ,
        <Route path="/*" element={<FourNotFour />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
