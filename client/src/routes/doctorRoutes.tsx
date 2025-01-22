import { Route } from 'react-router-dom';
import LandingPageDoctor from '../pages/doctor/LandingPage';
import SignIn from '../components/doctor/SignIn';

export const doctorRoutes = [
    
  <Route path="/doctor-recruitement" element={<LandingPageDoctor />} />,
  <Route path='/doctor/signin' element={<SignIn />} />
];