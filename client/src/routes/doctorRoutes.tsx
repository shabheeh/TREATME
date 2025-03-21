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
import PatientListPage from "../components/doctor/PatientsList";
import PatientProfile2 from "../pages/doctor/PatientProfile2";
import LayoutAccount from "../Layouts/doctor/LayoutAccount";
import WalletPatient from "../components/basics/wallet/Wallet";
import Security from "../components/basics/Security";

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
    path="/doctor/account"
    element={
      <ProtectedRoute allowedRoles={["doctor"]}>
        <LayoutAccount />
      </ProtectedRoute>
    }
  >
    <Route path="wallet" element={<WalletPatient />} />
    <Route path="security" element={<Security />} />
  </Route>,
  <Route
    path="/doctor"
    element={
      <ProtectedRoute allowedRoles={["doctor"]}>
        <LayoutDoctor />
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="appointments" element={<Appointments />} />
    <Route path="messages" element={<Messages />} />
    <Route path="schedules" element={<Schedule />} />
    <Route path="notifications" element={<Notifications />} />
    <Route path="patients" element={<PatientListPage />} />
    <Route path="patients/health" element={<PatientProfile />} />
    <Route path="patients/health2" element={<PatientProfile2 />} />
  </Route>,
];
