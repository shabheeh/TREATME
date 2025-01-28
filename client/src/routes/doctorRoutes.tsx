import { Route } from 'react-router-dom';
import LandingPageDoctor from '../pages/doctor/LandingPage';
import SignIn from '../components/doctor/SignIn';
import AntiProtectedRoute from './AntiProtectedRoute';
import ProtectedRoute from './ProtectedRoute';
import LayoutDoctor from '../Layouts/doctor/LayoutDoctor';
import { Dashboard } from '../pages/doctor/Dashboard';


export const doctorRoutes = [
    
  <Route path="/doctor-recruitement" element={<LandingPageDoctor />} />,
  <Route 
    path="/doctor/signin" 
    element={
      <AntiProtectedRoute redirectPath='/doctor'>
        <SignIn />
      </AntiProtectedRoute>
      } 
  />,
  <Route
    path="/doctor"
    element={
      <ProtectedRoute allowedRoles={['doctor']}>
        <LayoutDoctor />
      </ProtectedRoute>
    }
  >
    <Route path="" element={<Dashboard />} />
    
  </Route>
];