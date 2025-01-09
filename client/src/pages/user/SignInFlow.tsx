import React, { useState } from "react";
import { Box } from "@mui/material";
import Navbar from "../../components/basics/Navbar";
import SignIn from "../../components/user/SignIn";
import ResetPassword from "../../components/user/ResetPassword";
import ForgotPassword from "../../components/user/ForgotPassword";
import Otp from "../../components/user/Otp";
import CompleteProfile from "../../components/user/CompleteProfile";
import { IUser } from "../../types/user/authTypes";

type Steps = "signin" | "forgot-password" | "verfy-otp" | "reset-password" | "complete-profile";

const SignInFlow: React.FC = () => {
  const [step, setStep] = useState<Steps>("signin");
  const [user, setUser] = useState<Partial<IUser> | null>(null)

  const goToForgotPassword = () => setStep("forgot-password")
  const gotVerifyOtp = () => setStep('verfy-otp')
  const goToRestPassword = () => setStep("reset-password")
  const goToCompleteProfile = (user: Partial<IUser>) => {
    setUser(user)
    setStep("complete-profile")
  }



  return (
    <Box sx={{ bgcolor: "whitesmoke", minHeight: "100vh", width: "100%" }}>
      <Navbar />
      {step === "signin" && <SignIn onForgotPassword={goToForgotPassword} onCompleteProfile={(user) => goToCompleteProfile(user)} />}
      {step === "forgot-password" && <ForgotPassword onVerifyEmail={gotVerifyOtp} />}
      {step === "verfy-otp" && <Otp isVerifyEmail={false} onVerifySignIn={goToRestPassword} />}
      {step === 'reset-password' && <ResetPassword />}
      {step === 'complete-profile' && <CompleteProfile userData={user} />}

    </Box>
  );
};

export default SignInFlow;
