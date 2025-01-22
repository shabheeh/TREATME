import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from '../pages/user/LandingPage';
import SignInFlow from '../pages/user/SignInFlow';
import SignUpFlow from '../pages/user/SignUpFlow';
import LayoutUser from '../Layouts/patient/LayoutPatient';
import VisiitNow from '../pages/user/VisitNow';

export const patientRoutes = [

  <Route path="/" element={<LandingPage />} />,
  <Route path="/signin" element={<SignInFlow />} />,
  <Route path="/signup" element={<SignUpFlow />} />,
  <Route
    path="/"
    element={
      <ProtectedRoute allowedRoles={['patient']}>
        <LayoutUser />
      </ProtectedRoute>
    }
  >
    <Route path="visitnow" element={<VisiitNow />} />
  </Route>
];