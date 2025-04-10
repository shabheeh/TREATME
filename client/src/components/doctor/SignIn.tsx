import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import doctorAuthService from "../../services/doctor/authService";
import Navbar from "../basics/Navbar";
import { toast } from "sonner";
interface SignInFormInputs {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: SignInFormInputs) => {
    try {
      setLoading(true);
      await doctorAuthService.signIn(data.email, data.password);
      navigate("/doctor/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "whitesmoke", minHeight: "100vh", width: "100%" }}>
      <Navbar />
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
              marginBottom: 10,
            }}
          >
            Provider Sign in
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
              sx={{ width: "80%", margin: "10px auto" }}
            />
            <TextField
              {...register("password", {
                required: "Password is required",
              })}
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ width: "80%", margin: "10px auto" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              loading={loading}
              disabled={loading}
              type="submit"
              variant="contained"
              sx={{ py: 2, mt: 3, mb: 13, width: "80%", fontSize: "1rem" }}
            >
              Sign In
            </Button>
          </Container>
        </Container>
      </Box>
    </Box>
  );
};

export default SignIn;
