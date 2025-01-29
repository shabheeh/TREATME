import {
  Box,
  Container,
  Typography,
  TextField,
  Link,
  Button,
  // Divider,
} from "@mui/material";

import { useForm } from "react-hook-form";
import authServicePatient from "../../../services/patient/authService";
import log from "loglevel";
import { toast } from "sonner";
import { useState } from "react";

type ForgotPasswordProps = {
  onVerifyEmail: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onVerifyEmail }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    defaultValues: {
      email: "",
    },
  });

  const [loading, setLoading] = useState(false);


  const onSubmit = async ({ email }: { email: string }) => {
    try {
      setLoading(true)
      const result = await authServicePatient.verifyEmail(email);
    if ('user' in result) {
          onVerifyEmail()
    }
    setLoading(false)

    } catch (error) {
      setLoading(false)
      if(error instanceof Error) {
        toast.error(error.message)
      }
      log.error('error during verifying email', error)
    }
  };

  return (
    <Box sx={{ py: 15 }}>
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
          Forgot Password
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
          Enter the reagisterd email to sent an otp to reset password
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
          <TextField
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            label="Email"
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ width: "80%", margin: "20px auto" }}
          />
          <Button
            loading={loading}
            disabled={loading}
            variant="contained"
            type="submit"
            sx={{ py: 1, width: "80%", fontSize: "1rem" }}
          >
            Continue
          </Button>
          {/* <Divider sx={{ mt: 5, width: "100%" }}>Or</Divider> */}

          
          <Typography
            variant="body2"
            sx={{ mt: 5, mb: 5, textAlign: "center", color: "gray" }}
          >
            Don’t have an account?{" "}
            <Link href="/signup" underline="hover" sx={{ color: "teal", }}>
              Sign up here
            </Link>
          </Typography>
        </Container>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
