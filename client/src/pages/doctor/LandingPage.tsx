import Navbar from "../../components/basics/Navbar";
import {
  Box,
  Button,
  Container,
  Grid,
  List,
  ListItem,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";


import bgImage from "../../assets/Hero-banner.jpg";
import { TiPlus } from "react-icons/ti";
import { Link } from "react-router-dom";

import { useForm, Controller } from "react-hook-form"
import applicantService from "../../services/applicant/applicantService";
import { toast } from "sonner";

interface RegisterFormInputs {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    registerNo: string;
    speciality: string
}

const LandingPage = () => {

    const { 
        register, 
        handleSubmit,
        control,
        formState: { errors } 
    } = useForm<RegisterFormInputs>({
        defaultValues: {
        firstName:  "",
        lastName:  "",
        email: "",
        phone: "",
        registerNo: "",
        speciality: ""
        }
    });


    const types = [ "Primary Care", "Dermatology", "Psychiatry", "Therapy"]

    const onSubmit = async(data: RegisterFormInputs) => {

        try {

          const promise = applicantService.createApplicant(data);

          toast.promise(promise, {
            loading: 'Submitting application...',
            success: (result) => {
              return result.message; 
            },
            error: (error) => {
              return error.message
            }
          });


        } catch (error) {
          if(error instanceof Error) {
            toast.error('Error Sending Application')
          }else {
            toast.error('Something Went Wrong')
            console.log(error)
          }
          
        }
    }



  return (
    <Box>

        <Navbar />  
      <Box sx={{ bgcolor: "white", color: "teal" }}>
        <Container maxWidth="xl" disableGutters>
          <Grid container alignItems="center">
            <Grid item xs={12} md={6} sx={{ py: 10, px: 10 }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                fontWeight="bold"
              >
                Become a Health Provider at Treatme
              </Typography>
              <Typography variant="h5" paragraph sx={{ mb: 4 }}>
                Connect with top healthcare providers from the comfort of your
                home. Quality care, when you need it most.
              </Typography>
              <Link to={'/doctor/signin'}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "white",
                  color: "teal",
                  "&:hover": { bgcolor: "grey.100" },
                  borderRadius: 28,
                  px: 4,
                }}
              >
                Sign in
              </Button>
              </Link>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ position: "relative", height: "100%" }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,5.95) 0%, rgba(255,255,255,0.5) 25%, rgba(255,255,255,0) 100%)",
                    zIndex: 1,
                    pointerEvents: "none",
                  },
                }}
              >
                <Box
                  component="img"
                  src={bgImage}
                  alt="Telemedicine Consultation"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>


      <Box sx={{ py: 10, mx: 10, bgcolor: "background.paper" }}>
        <Container maxWidth="xl">
          <Typography variant="body1" 
          sx={{
            color: 'GrayText'
          }}>
          Thank you for your interest in joining the Treateme provider network! At Treateme, 
          we are dedicated to delivering exceptional care and leveraging cutting-edge technology to 
          revolutionize healthcare. Our commitment to innovation creates opportunities to enhance patient outcomes, 
          reduce costs, and expand access to quality care through virtual consultations. By joining our network, 
          you’ll play a key role in providing telehealth consultations to our growing community of patients through 
          employer partnerships and direct-to-consumer services.
          </Typography>
          <Grid container spacing={6} sx={{ mt: 4 }}>
          <Grid item xs={12} sm={6} >
            <ListItem>
              <Typography variant="body1" component="li" sx={{
                color: 'GrayText'
              }}>
              Medical providers must hold a valid MD or equivalent qualification in their respective specialties, 
              certified by the Medical Council of India (MCI) or the National Medical Commission (NMC). Preferred specialties 
              include  General Medicine, Pediatrics, Dermatology, Therapy and Psychiatry.
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1" component="li" sx={{
                color: 'GrayText'
              }}>
              Physicians and Psychiatrists must have at least 4 years of post-PG (Postgraduate) clinical experience. 
              Clinical Psychologists and Therapists must be independently licensed with a minimum of 3 years of 
              post-licensure professional practice.
              </Typography>
            </ListItem>
            
          </Grid>
          <Grid item xs={12} sm={6} >
            <ListItem>
              <Typography variant="body1" component="li" sx={{
                color: 'GrayText'
              }}>
              Providers must maintain an active and unrestricted medical license with the State Medical Council or NMC. 
              Psychiatrists prescribing medications must hold a valid license to prescribe psychotropic drugs.
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1" component="li" sx={{
                color: 'GrayText'
              }}>
              We do not currently onboard nurse practitioners, physician assistants, physiotherapists, occupational 
              therapists, speech therapists, behavioral analysts, or dietitians onto our network.
              </Typography>
            </ListItem>
            
          </Grid>
          </Grid>
          <Grid container spacing={2}>
  <Grid item xs={12} md={8}>
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

      <Box sx={{ width: "100%", my: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              {...register("firstName", {
                required: "First Name is required",
                pattern: {
                  value: /^[A-Z][a-zA-Z' -]*$/,
                  message: "Please enter a valid First Name",
                },
              })}
              fullWidth
              label="First Name"
              variant="outlined"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              {...register("lastName", {
                required: "Last Name is required",
                pattern: {
                  value: /^[A-Z][a-zA-Z' -]*$/,
                  message: "Please enter a valid Last Name",
                },
              })}
              fullWidth
              label="Last Name"
              variant="outlined"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: "100%", my: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid Email",
                },
              })}
              fullWidth
              label="Email"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              {...register("phone", {
                required: "Phone Number is required",
                pattern: {
                    value: /^[2-9]\d{9}$/,
                    message: "Please enter a valid Phone Number"
                },
              })}
              fullWidth
              label="Phone Number"
              variant="outlined"
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: "100%", my: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              {...register("registerNo", {
                required: "Register No: is required",
                pattern: {
                    value: /^[A-Za-z0-9/-]{6,15}$/,
                  message: "Please enter a Register No",
                },
              })}
              fullWidth
              label="Register No:"
              variant="outlined"
              error={!!errors.registerNo}
              helperText={errors.registerNo?.message}
            />
          </Grid>
          <Grid item xs={6}>
          <Controller
                      name="speciality"
                      control={control}
                      rules={{ required: "Please Select the type" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Type of Provider"
                          error={!!errors.speciality}
                          helperText={errors.speciality?.message}
                        >
                          {types.map((type, idx) => (
                            <MenuItem key={idx} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
          </Grid>
        </Grid>
      </Box>
      <Button
        type="submit"
        variant="contained"
        sx={{ py: 1, px: 4,  my: 4, alignSelf: 'start', fontSize: "1rem" }}
      >
        Submit
      </Button>
    </Container>
  </Grid>

  <Grid item xs={12} md={4}>
    <Box
      
    >
      <Typography variant="h6" align="center">

      </Typography>
    </Box>
  </Grid>
</Grid>

        </Container>
      </Box>

      

      {/* Footer */}
      <Box sx={{ bgcolor: "grey.900", color: "white", py: 6 }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                {/* <AddIcon sx={{ fontSize: 24 }} /> */}
                <TiPlus size={30} />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  TreatMe
                </Typography>
              </Box>
              <Typography color="grey.400">
                Healthcare solutions for the digital age
              </Typography>
            </Grid>

            {[
              {
                title: "Services",
                items: ["Dermatology", "Urgent Care", "Therapy", "Psychiatry"],
              },
              {
                title: "Company",
                items: ["About Us", "Contact", "Privacy Policy"],
              },
              {
                title: "Contact",
                items: ["support@treatme.com", "1-800-TREATME", "Mon-Sun 24/7"],
              },
            ].map((section, index) => (
              <Grid item xs={12} md={3} key={index}>
                <Typography variant="h6" gutterBottom>
                  {section.title}
                </Typography>
                <List sx={{ p: 0 }}>
                  {section.items.map((item, idx) => (
                    <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                      <Typography color="grey.400">{item}</Typography>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              mt: 6,
              pt: 4,
              borderTop: 1,
              borderColor: "grey.800",
              textAlign: "center",
            }}
          >
            <Typography color="grey.400">
              &copy; 2025 TreatMe. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
