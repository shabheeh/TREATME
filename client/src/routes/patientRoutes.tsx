import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AntiProtectedRoute from './AntiProtectedRoute';
import LandingPage from '../pages/patient/LandingPage';
import SignInFlow from '../pages/patient/SignInFlow';
import SignUpFlow from '../pages/patient/SignUpFlow';
import LayoutPatient from '../Layouts/patient/LayoutPatient';
import VisiitNow from '../pages/patient/VisitNow';
import LayoutAccount from '../Layouts/patient/LayoutAccount';
import MyAccount from '../pages/patient/MyAccount';
import Family from '../pages/patient/Family';
import HealthProfile from '../pages/patient/HealthProfile';


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
    <Route path='health-profile' element={<HealthProfile />} />
  </Route>
];