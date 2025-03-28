import { Route } from "react-router-dom";
import LayoutAdmin from "../Layouts/admin/LayoutAdmin";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/admin/Dashboard";
import Patients from "../pages/admin/Patients";
import Doctors from "../pages/admin/Doctors";
import Applicants from "../pages/admin/Applicants";
import AddDoctor from "../components/admin/AddDoctor";
import Specializations from "../pages/admin/Specializations";
import AddSpecialization from "../components/admin/AddSpecialization";
import SignIn from "../components/admin/SignIn";
import EditSpecialization from "../components/admin/EditSpecialization";
import AntiProtectedRoute from "./AntiProtectedRoute";
import ApplicantDetails from "../components/admin/ApplicantDetails";
import Messages from "../components/basics/messages/Messages";
import DoctorProfile from "../components/basics/DoctorView";

export const adminRoutes = [
  <Route
    path="/admin/signin"
    element={
      <AntiProtectedRoute redirectPath="/admin">
        <SignIn />
      </AntiProtectedRoute>
    }
  />,
  <Route
    path="/admin"
    element={
      <ProtectedRoute allowedRoles={["admin"]}>
        <LayoutAdmin />
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="patients" element={<Patients />} />
    <Route path="doctors" element={<Doctors />} />
    <Route path="doctors/:doctorId" element={<DoctorProfile />} />
    <Route path="messages" element={<Messages />} />
    <Route path="applications" element={<Applicants />} />
    <Route path="recruitements/:id" element={<ApplicantDetails />} />
    <Route path="add-doctor" element={<AddDoctor />} />
    <Route path="specializations" element={<Specializations />} />
    <Route path="specializations/add" element={<AddSpecialization />} />
    <Route
      path="specializations/edit/:specializationId"
      element={<EditSpecialization />}
    />
  </Route>,
];
