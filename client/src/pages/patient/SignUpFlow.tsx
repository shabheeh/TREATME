import React, { useState } from "react";
import { Box } from "@mui/material";
import Navbar from "../../components/basics/Navbar";
import SignUp from "../../components/patient/auth/SignUp";
import Otp from "../../components/patient/auth/Otp";
import CompleteProfile from "../../components/patient/auth/CompleteProfile";

const SignUpFlow: React.FC = () => {
  const [step, setStep] = useState<"signup" | "verfy-email" | "complete-profile">("signup");

  const goVerifyEmail = () => setStep("verfy-email");
  const goToCompleteProfile = () => setStep("complete-profile");

  return (
    <Box sx={{ bgcolor: "whitesmoke", minHeight: "100vh", width: "100%" }}>
      <Navbar />
      {step === "signup" && <SignUp onSignUp={goVerifyEmail} onCompleteProfile={goToCompleteProfile} />}  
      {step === "verfy-email" && <Otp isVerifyEmail={true} onVerifySignUp={goToCompleteProfile} />}
      {step === "complete-profile" && <CompleteProfile  isPartialUser={false} />}
    </Box>
  );
};

export default SignUpFlow;
