import { Box } from "@mui/material"
import { useLocation } from 'react-router-dom';
import Navbar from "../../components/basics/Navbar"
import SignIn from "../../components/user/SignIn";
import SignUp from "../../components/user/SignUp"
import Otp from "../../components/user/Otp";
import CompleteProfile from "../../components/user/CompleteProfile";
import ResetPassword from "../../components/user/ResetPassword";

const Authentication = () => {

    const location = useLocation()
    
    let ComponentToRender 

    if (location.pathname === '/signin') {
        ComponentToRender = <SignIn />;
    } else if (location.pathname === '/signup') {
        ComponentToRender = <SignUp />;
    } else if (location.pathname === '/otp') {
        ComponentToRender = <Otp  isVerifyEmail={false} />;
    } else if (location.pathname === '/verify-email') {
        ComponentToRender = <Otp  isVerifyEmail={true} />;
    } else if (location.pathname === '/complete-profile') {
        ComponentToRender = <CompleteProfile />;
    } else if (location.pathname === '/reset-password') {
        ComponentToRender = <ResetPassword />;
    }

  return (
    <Box sx={{ bgcolor: "whitesmoke", minHeight: "100vh", width: "100%" }}>
        <Navbar />
        { ComponentToRender }
    </Box>
  )
}

export default Authentication