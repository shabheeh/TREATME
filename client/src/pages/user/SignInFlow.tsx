import React, { useState } from "react";
import { Box } from "@mui/material";
import Navbar from "../../components/basics/Navbar";
import SignIn from "../../components/patient/SignIn";
import ResetPassword from "../../components/patient/ResetPassword";
import ForgotPassword from "../../components/patient/ForgotPassword";
import Otp from "../../components/patient/Otp";
import CompleteProfile from "../../components/patient/CompleteProfile";

type Steps = "signin" | "forgot-password" | "verfy-otp" | "reset-password" | "complete-profile";

const SignInFlow: React.FC = () => {
  const [step, setStep] = useState<Steps>("signin");
  const [partialUser, setPartialUser] = useState(false);

  const goToForgotPassword = () => setStep("forgot-password");
  const gotVerifyOtp = () => setStep("verfy-otp");
  const goToRestPassword = () => setStep("reset-password");
  const goToCompleteProfile = () => {
    setPartialUser(true);
    setStep("complete-profile");
  };
  const goToSignIn = () => setStep("signin");

  return (
    <Box sx={{ bgcolor: "whitesmoke", minHeight: "100vh", width: "100%" }}>
      <Navbar />
      {step === "signin" && (
        <SignIn 
          onForgotPassword={goToForgotPassword}
          onCompleteProfile={goToCompleteProfile}
        />
      )}
      {step === "forgot-password" && <ForgotPassword onVerifyEmail={gotVerifyOtp} />}
      {step === "verfy-otp" && <Otp isVerifyEmail={false} onVerifySignIn={goToRestPassword} />}
      {step === "reset-password" && <ResetPassword onResetPassword={goToSignIn} />}
      {step === "complete-profile" && <CompleteProfile isPartialUser={partialUser} />}
    </Box>
  );
};

export default SignInFlow;