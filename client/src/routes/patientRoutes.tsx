import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AntiProtectedRoute from './AntiProtectedRoute';
import LandingPage from '../pages/user/LandingPage';
import SignInFlow from '../pages/user/SignInFlow';
import SignUpFlow from '../pages/user/SignUpFlow';
import LayoutPatient from '../Layouts/patient/LayoutPatient';
import VisiitNow from '../pages/user/VisitNow';
import LayoutAccount from '../Layouts/patient/LayoutAccount';
import MyAccount from '../pages/user/MyAccount';
import Family from '../pages/user/Family';

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
      <ProtectedRoute allowedRoles={['patient']}>
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
      <ProtectedRoute allowedRoles={['patient']}>
        <LayoutPatient />
      </ProtectedRoute>
    }
  >
    <Route path="visitnow" element={<VisiitNow />} />
  </Route>
];