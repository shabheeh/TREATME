import { Route } from 'react-router-dom';
import LayoutAdmin from '../Layouts/admin/LayoutAdmin';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '../pages/admin/Dashboard';
import Patients from '../pages/admin/Patients';
import Doctors from '../pages/admin/Doctors';
import Applicants from '../pages/admin/Applicants';
import AddDoctor from '../components/admin/AddDoctor';
import Specializations from '../pages/admin/Specializations';
import AddSpecialization from '../components/admin/AddSpecialization';
import SignIn from '../components/admin/SignIn';

export const adminRoutes = [
    
  <Route path="/admin/signin" element={<SignIn />} />,
  <Route
    path="/admin"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <LayoutAdmin />
      </ProtectedRoute>
    }
  >
    <Route path="" element={<Dashboard />} />
    <Route path="patients" element={<Patients />} />
    <Route path="doctors" element={<Doctors />} />
    <Route path="recruitements" element={<Applicants />} />
    <Route path="add-doctor" element={<AddDoctor />} />
    <Route path="specializations" element={<Specializations />} />
    <Route path="add-specialization" element={<AddSpecialization />} />
  </Route>
];
