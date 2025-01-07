import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Link,
  Button,
  Divider,
} from "@mui/material"
import { useForm } from "react-hook-form"


interface SignInFormInputs {
  email: string;
  password: string;
}


const SignIn = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormInputs>({ defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = (data: SignInFormInputs) => {
    console.log(data);
    
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
            <Link
              href="forgot-password"
              underline="hover"
              sx={{
                fontSize: "0.8rem",
                color: "gray",
                alignSelf: "flex-start", 
                marginLeft: "10%", 
                mt: 1.5,
                mb: 2
              }}
            >
              Forgot Password
            </Link>
            <Button 
              type="submit" 
              variant="contained"  
              sx={{ py: 2, my: 2, width: '80%', fontSize: '1rem' }}
            >
              Sign In
            </Button>
            <Divider sx={{ mt: 5, width: '100%' }}>Or</Divider>
            <Link
              href="/auth/google"
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