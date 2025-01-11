import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Link,
  Button,
  Divider,
  CircularProgress 
} from "@mui/material"
import { useForm } from "react-hook-form"
import authServiceUser from "../../services/user/authService";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

interface SignInFormInputs {
  email: string;
  password: string;
}

interface SignInProps {
  onForgotPassword: () => void;
  onCompleteProfile: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onForgotPassword, onCompleteProfile }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormInputs>({ 
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async(data: SignInFormInputs) => {
    try {
      setLoading(true)
      await authServiceUser.signInUser(data)
      navigate('/patient')
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false)
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error('No credentials received');
      }

      const credential = credentialResponse.credential
      const isPartialUser = await authServiceUser.googleSignIn(credential)

      if (isPartialUser) {
        onCompleteProfile();
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };
  // const handleGoogleSignIn = async () => {
  //   try {
  //     const result = await authServiceUser.googleSignIn(); 
  
  //     if ("error" in result) { 
  //       console.error(result.error);
  //       return;
  //     }
  
  //     const { isPartialUser, user } = result;
  
  //     if (isPartialUser) {
  //       onCompleteProfile(user); 
  //     }else {
  //       navigate('/patient')
  //     }
  //   } catch (error) {
  //     console.log((error as Error).message);
  //   }
  // };
  

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
              marginBottom: 10,
            }}
          >
            Sign in to your account
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
                  message: "Invalid email address"
                }
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
              type="password"
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ width: "80%", margin: "10px auto" }}
            />
            <Typography
              sx={{
                fontSize: "0.8rem",
                color: "gray",
                alignSelf: "flex-start",
                marginLeft: "10%",
                mt: 1.5,
                mb: 2,
                cursor: 'pointer',
                textDecoration: 'none', 
                '&:hover': {
                  textDecoration: 'underline', 
                },
              }}
              onClick={onForgotPassword}
            >
              Forgot Password
            </Typography>
            <Button 
              type="submit" 
              variant="contained"  
              sx={{ py: 2, my: 2, width: '80%', fontSize: '1rem' }}
            > 
            { loading ? <CircularProgress /> : "Sign In" }
              
            </Button>
            <Divider sx={{ mt: 5, width: '100%' }}>Or</Divider>
            <Box sx={{ display: 'flex', justifyContent: 'center', m: 2 }}>
              <GoogleLogin
              
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.error('Google sign-in failed');
                }}
                useOneTap
              />
            </Box>
            <Typography
              variant="body2"
              sx={{ mt: 1, mb: 5, textAlign: "center", color: "gray" }}
            >
              Don't have an account?{" "}
              <Link href="/signup" underline="hover" sx={{ color: "teal" }}>
                Sign up here
              </Link>
            </Typography>
          </Container>
        </Container>
      </Box>
  )
}

export default SignIn