import React, { useState } from "react";
import { Box } from "@mui/material";
import Navbar from "../../components/basics/Navbar";
import SignUp from "../../components/user/SignUp";
import Otp from "../../components/user/Otp";
import CompleteProfile from "../../components/user/CompleteProfile";

const SignUpFlow: React.FC = () => {
  const [step, setStep] = useState<"signup" | "verfy-email" | "complete-profile">("signup");

  const goVerifyEmail = () => setStep("verfy-email");
  const goToCompleteProfile = () => setStep("complete-profile");

  return (
    <Box sx={{ bgcolor: "whitesmoke", minHeight: "100vh", width: "100%" }}>
      <Navbar />
      {step === "signup" && <SignUp onSignUp={goVerifyEmail} />}  
      {step === "verfy-email" && <Otp isVerifyEmail={true} onVerify={goToCompleteProfile} />}
      {step === "complete-profile" && <CompleteProfile />}
    </Box>
  );
};

export default SignUpFlow;
