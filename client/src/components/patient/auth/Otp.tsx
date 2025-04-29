import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, Container, Typography, Link, Button } from "@mui/material";
import PinInput from "react-pin-input";
import SignupPath from "./SignupPath";
// import { IUser } from "../../types/user/authTypes";
import authServicePatient from "../../../services/patient/authService";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import { toast } from "sonner";

interface OtpPageProps {
  isVerifyEmail: boolean;
  onVerifySignUp?: () => void;
  onVerifySignIn?: () => void;
}

interface OtpFormValues {
  otp: string;
}

const Otp: React.FC<OtpPageProps> = ({
  isVerifyEmail,
  onVerifySignUp,
  onVerifySignIn,
}) => {
  const [seconds, setSeconds] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const tempUser = useSelector((state: RootState) => state.tempUser.tempUser);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<OtpFormValues>({
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (isTimerActive && seconds > 0) {
      const timer = setInterval(() => setSeconds((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (seconds === 0) {
      setIsTimerActive(false);
    }
  }, [isTimerActive, seconds]);

  const handleResendOtp = async () => {
    setSeconds(30);
    setIsTimerActive(true);
    try {
      if (isVerifyEmail) {
        if (!tempUser?.email) {
          throw new Error("somethig went wrong please try again");
        }
        await authServicePatient.resendOtp(tempUser.email);
      } else {
        if (!tempUser?.email) {
          throw new Error("somethig went wrong please try again");
        }
        await authServicePatient.resendOtpForgotPassword(tempUser?.email);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
    }
  };

  const onSubmit = async (data: OtpFormValues) => {
    try {
      setLoading(true);
      if (isVerifyEmail) {
        if (!tempUser?.email) {
          throw new Error("somethig went wrong please try again");
        }
        await authServicePatient.verifyOtpSignUp(tempUser.email, data.otp);
        if (onVerifySignUp) {
          onVerifySignUp();
        }
      } else {
        if (!tempUser?.email) {
          throw new Error("somethig went wrong please try again");
        }
        await authServicePatient.verifyOtpForgotPassword(
          tempUser.email,
          data.otp
        );
        if (onVerifySignIn) {
          onVerifySignIn();
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 15 },
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          bgcolor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          boxShadow: { xs: 0, sm: 3 },
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{
            color: "teal",
            textDecoration: "underline",
            mt: { xs: 2, sm: 5 },
            mb: 2,
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
          }}
        >
          {isVerifyEmail ? "Verify your Email" : "Forgot Password"}
        </Typography>
        <Typography
          variant="body2"
          component="p"
          textAlign="center"
          gutterBottom
          color="secondary"
          sx={{
            mt: 2,
            mb: { xs: 6, sm: 10 },
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
        >
          {isVerifyEmail ? <SignupPath step={2} /> : ""}
          Please enter the OTP sent to your email
        </Typography>
        <Container
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: 400,
          }}
        >
          {errors.otp && (
            <Typography
              color="error"
              sx={{
                mt: -5,
                mb: 2,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              {errors.otp.message}
            </Typography>
          )}

          <Controller
            name="otp"
            control={control}
            rules={{
              required: "OTP is required",
              minLength: { value: 6, message: "OTP must be 6 digits" },
              maxLength: { value: 6, message: "OTP must be 6 digits" },
            }}
            render={({ field }) => (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: { xs: "8px", sm: "12px" },
                  flexWrap: "nowrap",
                  pb: { xs: "30px", sm: "40px" },
                  width: "100%",
                }}
              >
                <PinInput
                  length={6}
                  initialValue=""
                  onChange={(value) => field.onChange(value)}
                  type="numeric"
                  inputMode="number"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "nowrap",
                    width: "100%",
                  }}
                  inputStyle={{
                    borderColor: errors.otp ? "red" : "gray",
                    borderWidth: "2px",
                    width: "36px",
                    height: "36px",
                    textAlign: "center",
                    fontSize: "0.875rem",
                    borderRadius: "4px",
                    margin: "0 2px",
                  }}
                  inputFocusStyle={{
                    borderColor: "teal",
                    borderWidth: "2px",
                  }}
                  onComplete={(value) => setValue("otp", value)}
                  autoSelect={true}
                  regexCriteria={/^[0-9]*$/}
                />
              </Box>
            )}
          />

          <Button
            loading={loading}
            disabled={loading}
            type="submit"
            variant="contained"
            sx={{
              py: 1,
              width: { xs: "100%", sm: "80%" },
              fontSize: { xs: "0.875rem", sm: "1rem" },
              mt: 2,
            }}
          >
            Continue
          </Button>
          <Typography
            variant="body2"
            sx={{
              mt: 3,
              mb: 5,
              textAlign: "center",
              color: "gray",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            Didn't receive the OTP?{" "}
            <Link
              component="button"
              underline="none"
              sx={{
                color: "teal",
                cursor: isTimerActive ? "wait" : "pointer",
              }}
              onClick={handleResendOtp}
              disabled={isTimerActive}
            >
              {isTimerActive ? `Resend OTP in ${seconds}s` : "Resend OTP"}
            </Link>
          </Typography>
        </Container>
      </Container>
    </Box>
  );
};

export default Otp;
