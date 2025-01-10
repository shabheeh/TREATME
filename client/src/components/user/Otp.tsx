import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, Container, Typography, Link, Button } from "@mui/material";
import PinInput from "react-pin-input";
import SignupPath from "./SignupPath";
// import { IUser } from "../../types/user/authTypes";
import authServiceUser from "../../services/user/authService";
import { useSelector } from 'react-redux' 
import { RootState } from "../../redux/app/store";

interface OtpPageProps {
  isVerifyEmail: boolean;
  onVerifySignUp?: () => void;
  onVerifySignIn?: () => void;
}

interface OtpFormValues {
  otp: string;

}

const Otp: React.FC<OtpPageProps> = ({ isVerifyEmail, onVerifySignUp, onVerifySignIn }) => {
  const [seconds, setSeconds] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const tempUser = useSelector((state:RootState) => state.tempUser.tempUser)

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

  const handleResendOtp = () => {
    setSeconds(30);
    setIsTimerActive(true);
    // Logic to resend OTP
  };

  const onSubmit = async(data: OtpFormValues) => {
    console.log('otpdata', data)
    try {
      if (isVerifyEmail) {
        if (!tempUser?.email) {
          throw new Error('somethig went wrong please try again')
        }
        await authServiceUser.verifyOtpSignUp(tempUser.email, data.otp)
        if(onVerifySignUp) {
          onVerifySignUp()
        }
      }else {
        if (!tempUser?.email) {
          throw new Error('somethig went wrong please try again')
        }
        await authServiceUser.verifyOtpForgotPassword(tempUser.email, data.otp)
        if(onVerifySignIn) {
          onVerifySignIn()
        }
      }
    } catch (error) {
      console.log(error)
    }

    
  };

  return (
    <Box sx={{ py: 10 }}>
      <Container
        maxWidth="sm"
        sx={{
          bgcolor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
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
            marginTop: 5,
            marginBottom: 2,
          }}
        >
          {isVerifyEmail ? "Verify your Email" : "Forgot Password"}
        </Typography>
        <Typography
          variant="body2"
          component="h2"
          textAlign="center"
          gutterBottom
          color="secondary"
          sx={{
            marginTop: 2,
            marginBottom: 10,
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
          }}
        >
          {errors.otp && (
              <Typography color="error" sx={{ mt: -5, mb: 2 }}>
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
                <PinInput
                  length={6}
                  initialValue=""
                  onChange={(value) => field.onChange(value)}
                  type="numeric"
                  inputMode="number"
                  style={{
                    marginTop: "5px",
                    paddingBottom: "50px",
                    display: "flex",
                    gap: "15px",
                  }}
                  inputStyle={{
                    borderColor: errors.otp ? "red" : "gray",
                    borderWidth: "2px",
                    width: "50px",
                    height: "50px",
                    textAlign: "center",
                  }}
                  inputFocusStyle={{
                    borderColor: "teal",
                    borderWidth: "2px",
                  }}
                  onComplete={(value) => setValue("otp", value)}
                  autoSelect={true}
                  regexCriteria={/^[0-9]*$/}
                />
              )}
            />
            
            <Button
              type="submit"
              variant="contained"
              sx={{ py: 1, width: "80%", fontSize: "1rem" }}
            >
              Continue
            </Button>
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              m: 5,
              textAlign: "center",
              color: "gray",
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
