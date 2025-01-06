import { 
    Box, 
    Container, 
    Typography, 
    TextField, 
    Link,
    Button,
    Divider,
   } from "@mui/material"
  import Navbar from "../../components/basics/Navbar"
  
  
  const ForgotPasswordPage = () => {
    return (
        <Box sx={{ bgcolor: "whitesmoke", minHeight: "100vh", width: "100%" }}>
    <Navbar />
  
  <Box sx={{ py: 10, bgcolor: "whitesmoke" }}>
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
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          sx={{ width: "80%", margin: "20px auto" }}
        />
        <Button variant="contained"  sx={{ py: 1, width: '80%',  fontSize: '1rem'  }}>Continue</Button>
        <Divider sx={{ mt: 5, color: 'gray'}}>OR</Divider>
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
        Don’t have an account?{" "}
        <Link href="/signup" underline="hover" sx={{ color: "teal" }}>
          Sign up here
        </Link>
      </Typography>
      </Container>
    </Container>
  </Box>
  </Box>
  
  
    )
  }
  
  export default ForgotPasswordPage