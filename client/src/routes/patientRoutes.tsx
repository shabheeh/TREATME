import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AntiProtectedRoute from "./AntiProtectedRoute";
import LandingPage from "../pages/patient/LandingPage";
import SignInFlow from "../pages/patient/SignInFlow";
import SignUpFlow from "../pages/patient/SignUpFlow";
import LayoutPatient from "../Layouts/patient/LayoutPatient";
import VisiitNow from "../pages/patient/VisitNow";
import LayoutAccount from "../Layouts/patient/LayoutAccount";
import MyAccount from "../pages/patient/MyAccount";
import Family from "../pages/patient/Family";
import HealthProfile from "../pages/patient/HealthProfile";
import LayoutAppointment from "../Layouts/patient/LayoutAppointment";
import ReviewBehaviouralHealth from "../pages/patient/appointment/ReviewBehaviouralHealth";
import ReviewHealthHistory from "../pages/patient/appointment/ReviewHealthHistory";
import ListDoctors from "../pages/patient/appointment/ListDoctors";
import BookingConfirmation from "../pages/patient/appointment/BookingConfirmation";
import Appointments from "../pages/patient/appointment/Appointments";
import DoctorView from "../components/basics/DoctorView";
import Consultation from "../pages/shared/Consultation";
import PaymentWrapper from "../pages/patient/payment/PaymentWrapper";
import Doctors from "../pages/patient/Doctors";
import Messages from "../components/basics/messages/Messages";
import Notification from "../components/basics/notification/Notification";
import WalletPatient from "../components/basics/wallet/Wallet";
import Security from "../components/basics/Security";
import HelpAndSupportPage from "../pages/patient/HelpAndSupport";
import Concern from "../pages/patient/appointment/Concern";

export const patientRoutes = [
  <Route path="/" element={<LandingPage />} />,
  <Route
    path="/signin"
    element={
      <AntiProtectedRoute>
        <SignInFlow />
      </AntiProtectedRoute>
    }
  />,
  <Route
    path="/signup"
    element={
      <AntiProtectedRoute>
        <SignUpFlow />
      </AntiProtectedRoute>
    }
  />,
  <Route
    path="/account"
    element={
      <ProtectedRoute allowedRoles={["patient"]}>
        <LayoutAccount />
      </ProtectedRoute>
    }
  >
    <Route path="" element={<MyAccount />} />
    <Route path="family-members" element={<Family />} />
    <Route path="wallet" element={<WalletPatient />} />
    <Route path="security" element={<Security />} />
  </Route>,

  <Route
    path="/"
    element={
      <ProtectedRoute allowedRoles={["patient"]}>
        <LayoutAppointment />
      </ProtectedRoute>
    }
  >
    <Route path="reason" element={<Concern />} />
    <Route
      path="review-behavioural-health"
      element={<ReviewBehaviouralHealth />}
    />
    ,
    <Route path="review-health-history" element={<ReviewHealthHistory />} />,
    <Route path="providers" element={<ListDoctors />} />,
    <Route path="review-appointment" element={<PaymentWrapper />} />
    <Route path="confirmation" element={<BookingConfirmation />} />,
  </Route>,

  <Route
    path="/"
    element={
      <ProtectedRoute allowedRoles={["patient"]}>
        <LayoutPatient />
      </ProtectedRoute>
    }
  >
    <Route path="visitnow" element={<VisiitNow />} />
    <Route path="health-profile" element={<HealthProfile />} />
    <Route path="appointments" element={<Appointments />} />
    <Route path="consultations" element={<Consultation />} />
    <Route path="doctors" element={<Doctors />} />,
    <Route path="messages" element={<Messages />} />,
    <Route path="help" element={<HelpAndSupportPage />} />,
    <Route path="notifications" element={<Notification />} />
    <Route path="doctors/:doctorId" element={<DoctorView />} />,
  </Route>,
];
