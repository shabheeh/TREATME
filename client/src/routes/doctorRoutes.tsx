import { Route } from 'react-router-dom';
import LandingPageDoctor from '../pages/doctor/LandingPage';
import SignIn from '../components/doctor/SignIn';
import AntiProtectedRoute from './AntiProtectedRoute';


export const doctorRoutes = [
    
  <Route path="/doctor-recruitement" element={<LandingPageDoctor />} />,
  <Route 
  path="/admin/signin" 
  element={
    <AntiProtectedRoute redirectPath='/doctor'>
      <SignIn />
    </AntiProtectedRoute>
  } 
/>,
];