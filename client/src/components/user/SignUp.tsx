
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Link,
  Button,
  Divider,
} from "@mui/material"
import SignupPath from "./SignupPath"
import React from "react"
import { useForm } from "react-hook-form"

interface SignupFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<SignupFormInputs>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch("password");

  const onSubmit = (data: SignupFormInputs) => {
    console.log(data);
    // Handle form submission
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
              marginBottom: 1,
            }}
          >
            Sign up your account
          </Typography>
          <SignupPath step={1} />
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
                  message: "Invalid email address"
                }
              })}
              label="Email"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ width: "80%", mx: "auto", mt: '20px', mb: '10px'  }}
            />
            <TextField
              {...register("password", { 
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters"
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
                }
              })}
              type="password"
              label="Password"
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ width: "80%", mx: "auto", my: "10px" }}
            />
            <TextField
              {...register("confirmPassword", { 
                required: "Please confirm your password",
                validate: value => 
                  value === password || "Passwords do not match"
              })}
              type="password"
              label="Confirm Password"
              variant="outlined"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              sx={{ width: "80%", margin: "10px auto" }}
            />
            <Button 
              type="submit"
              variant="contained"  
              sx={{ py: 2, my: 2, width: '80%', fontSize: '1rem' }}
            >
              Sign Up
            </Button>
            <Divider sx={{ mt: 5, width: '100%' }}>Or</Divider>
            <Link
              href="#"
              underline="hover"
              sx={{
                fontSize: "1rem",
                m: 1,
              }}
            >
              Sign in with Google
            </Link>
            <Typography
              variant="body2"
              sx={{ mt: 1, mb: 5, textAlign: "center", color: "gray" }}
            >
              Already have an account?{" "}
              <Link href="/signin" underline="hover" sx={{ color: "teal" }}>
                Sign in here
              </Link>
            </Typography>
          </Container>
        </Container>
      </Box>
  )
}

export default SignUp