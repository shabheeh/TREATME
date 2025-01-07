import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./utils/theme";
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/user/LandingPage"
import SigninPage from "./components/user/SignIn";
import SignupPage from "./components/user/SignUp";
import ForgotPasswordPage from './components/user/ForgotPassword'
import OtpPage from "./components/user/Otp";
import CompleteProfile from "./components/user/CompleteProfile";
import Authentication from "./pages/user/Authentication";

function App() {


  return (
    <ThemeProvider theme={theme}>
     <CssBaseline />
     <Router>
      <Routes>
        <Route path="/" element={ <LandingPage />} />
        <Route path="/signin" element={ <Authentication />} />
        <Route path="/signup"element={ <Authentication />} />
        <Route path="/verify-email" element={ <Authentication />} />
        <Route path="/forgot-password" element={ <Authentication />} />
        <Route path="/otp" element={ <Authentication />} />
        <Route path="/complete-profile" element={ <Authentication />} />
        <Route path="/reset-password" element={ <Authentication />} />
      </Routes>
     </Router>
    </ThemeProvider>
  )
}

export default App
