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
import TherapyReason from "../pages/patient/appointment/TherapyReason";
import LayoutAppointment from "../Layouts/patient/LayoutAppointment";
import ReviewBehaviouralHealth from "../pages/patient/appointment/ReviewBehaviouralHealth";
import ReviewHealthHistory from "../pages/patient/appointment/ReviewHealthHistory";
import ListDoctors from "../pages/patient/appointment/ListDoctors";
// import Payment from "../pages/patient/appointment/Payment";
import BookingConfirmation from "../pages/patient/appointment/BookingConfirmed";
import Appointments from "../pages/patient/appointment/Appointments";
import DoctorView from "../components/basics/appointments/DoctorView";
import Consultations from "../pages/patient/appointment/Consultations";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
import PaymentWrapper from "../pages/patient/payment/PaymentWrapper";
import { Appearance } from "@stripe/stripe-js";
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY, {
//   betas: ["payment_element_beta_1"],
// });

// const options = {
//   mode: "payment",
//   amount: amount * 100, // amount in smallest currency unit
//   currency: "inr",
//   appearance: {
//     theme: "stripe",
//     variables: {
//       colorPrimary: "#008080",
//     },
//   },
// };

// return (
//   <Elements stripe={stripePromise} options={options}>
//     <PaymentForm appointmentData={appointmentData} />
//   </Elements>
// );

const appearance: Appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#008080", // teal color to match your border
    fontFamily: '"Roboto", sans-serif',
  },
};

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
  </Route>,

  <Route
    path="/"
    element={
      <ProtectedRoute allowedRoles={["patient"]}>
        <LayoutAppointment />
      </ProtectedRoute>
    }
  >
    <Route path="therapy/reason" element={<TherapyReason />} />
    <Route
      path="review-behavioural-health"
      element={<ReviewBehaviouralHealth />}
    />
    ,
    <Route path="review-health-history" element={<ReviewHealthHistory />} />,
    <Route path="doctors" element={<ListDoctors />} />,
    <Route path="doctors/:id" element={<DoctorView />} />,
    {/* <Route
      path="review-appointment"
      element={
        <Elements
          stripe={stripePromise}
          options={{ appearance, mode: "payment", currency: "inr" }}
        >
          <Payment />
        </Elements>
      }
    /> */}
    <Route path="review-appointment" element={<PaymentWrapper />} />
    <Route path="confirmed" element={<BookingConfirmation />} />,
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
    <Route path="consultations" element={<Consultations />} />
  </Route>,
];
