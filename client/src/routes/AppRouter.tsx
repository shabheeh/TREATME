import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { adminRoutes } from './adminRoutes';
import { patientRoutes } from './patientRoutes';
import { doctorRoutes } from './doctorRoutes';

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* public routes anyone can access */}
        <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
        
        {/* user routes */}
        {patientRoutes}
        {adminRoutes}
        {doctorRoutes}
      </Routes>
    </Router>
  );
}

export default AppRouter;