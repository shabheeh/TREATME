import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./utils/theme";
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/user/LandingPage"
// import Authentication from "./pages/user/Authentication";
// import SignInFlow from "./pages/user/SignInFlow";
import SignUpFlow from "./pages/user/SignUpFlow";

import { GoogleOAuthProvider } from '@react-oauth/google';

import SignInFlow from "./components/user/AuthFlow";


function App() {


  return (
    <ThemeProvider theme={theme}>
     <CssBaseline />
     <GoogleOAuthProvider clientId="800549462493-vcfh7ot3srocm1bsupi8o6joet9m5huc.apps.googleusercontent.com">

     <Router>
      <Routes>
        <Route path="/" element={ <LandingPage />} />
        {/* <Route path="/signin" element={ <Authentication />} />
        <Route path="/signup"element={ <Authentication />} />
        <Route path="/verify-email" element={ <Authentication />} />
        <Route path="/forgot-password" element={ <Authentication />} />
        <Route path="/otp" element={ <Authentication />} />
        <Route path="/complete-profile" element={ <Authentication />} />
        <Route path="/reset-password" element={ <Authentication />} /> */}
        <Route path="/signin" element={<SignInFlow />} />
        <Route path="/signup" element={<SignUpFlow />} />
        
      </Routes>
     </Router>
     </GoogleOAuthProvider>

    </ThemeProvider>
  )
}

export default App
