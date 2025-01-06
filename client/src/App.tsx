import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./utils/theme";
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/user/LandingPage"
import SigninPage from "./pages/user/SigninPage";
import SignupPage from "./pages/user/SignupPage";
import ForgotPasswordPage from './pages/user/ForgotPasswordPage'
import OtpPage from "./pages/user/OtpPage";

function App() {


  return (
    <ThemeProvider theme={theme}>
     <CssBaseline />
     <Router>
      <Routes>
        <Route path="/" element={ <LandingPage />} />
        <Route path="/signin" element={ <SigninPage />} />
        <Route path="/signup" element={ <SignupPage /> } />
        <Route path="/verify-email" element={ <OtpPage isVerifyEmail={true}  /> } />
        <Route path="/forgot-password" element={ <ForgotPasswordPage /> } />
        <Route path="/otp" element={ <OtpPage isVerifyEmail={false} /> } />
      </Routes>
     </Router>
    </ThemeProvider>
  )
}

export default App
