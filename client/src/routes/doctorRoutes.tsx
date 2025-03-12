import { Route } from "react-router-dom";
import LandingPageDoctor from "../pages/doctor/LandingPage";
import SignIn from "../components/doctor/SignIn";
import AntiProtectedRoute from "./AntiProtectedRoute";
import ProtectedRoute from "./ProtectedRoute";
import LayoutDoctor from "../Layouts/doctor/LayoutDoctor";
import { Dashboard } from "../pages/doctor/Dashboard";
import RegisterForm from "../components/doctor/RegisterForm";
import Schedule from "../pages/doctor/Schedule";
import Appointments from "../pages/doctor/Appointments";
import PatientProfile from "../pages/doctor/PatientProfile";
import Messages from "../components/basics/messages/Messages";
import Notifications from "../components/basics/notification/Notification";

export const doctorRoutes = [
  <Route path="/doctor-recruitement" element={<LandingPageDoctor />} />,
  <Route path="/doctor/apply" element={<RegisterForm />} />,
  <Route
    path="/doctor/signin"
    element={
      <AntiProtectedRoute redirectPath="/doctor">
        <SignIn />
      </AntiProtectedRoute>
    }
  />,
  <Route
    path="/doctor"
    element={
      <ProtectedRoute allowedRoles={["doctor"]}>
        <LayoutDoctor />
      </ProtectedRoute>
    }
  >
    <Route path="" element={<Dashboard />} />
    <Route path="appointments" element={<Appointments />} />
    <Route path="messages" element={<Messages />} />
    <Route path="schedules" element={<Schedule />} />
    <Route path="notifications" element={<Notifications />} />
    <Route path="patients/health" element={<PatientProfile />} />
  </Route>,
];
