import { useState, useEffect } from "react";
import { Box, Container, Typography, Link, Button } from "@mui/material";
import PinInput from "react-pin-input";
import SignupPath from "./SignupPath";

interface OtpPageProps {
    isVerifyEmail: boolean
}

const Otp: React.FC<OtpPageProps> = ({ isVerifyEmail }) => {
  const [pin, setPin] = useState("");
  const [seconds, setSeconds] = useState(30); 
  const [isTimerActive, setIsTimerActive] = useState(true); 

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
            { isVerifyEmail ?  'Verify your Email' : 'Forgot Password'}
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
            
            { isVerifyEmail ?  <SignupPath step={2} /> : ''}
            Please enter the otp sent to your email
          </Typography>
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PinInput
              length={6}
              initialValue=""
              onChange={(value, index) => setPin(value)}
              type="numeric"
              inputMode="number"
              style={{
                paddingBottom: "40px",
                display: "flex",
                gap: "15px",
              }}
              inputStyle={{
                borderColor: "gray",
                borderWidth: "2px",
                width: "50px",
                height: "50px",
                textAlign: "center",
              }}
              inputFocusStyle={{ borderColor: "teal", borderWidth: "2px" }}
              onComplete={(value, index) => {}}
              autoSelect={true}
              regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
            />
            <Button
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
                {isTimerActive
                  ? `Resend OTP in ${seconds}s`
                  : "Resend OTP"}
              </Link>
            </Typography>
          </Container>
        </Container>
      </Box>
  );
};

export default Otp;
