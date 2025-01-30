import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    Grid,
    Avatar,
    Chip,
    MenuItem,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import log from "loglevel";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import doctorsService from "../../services/admin/doctorsService";
import { useNavigate } from "react-router-dom";
import specializationService from "../../services/specialization/specializationService";
import { ISpecialization } from "../../types/specialization/specialization.types";
  
interface SignupFormInputs {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    languages: string[];
    experience: number | null;
    specialization: string;
    registerNo: string;
    licensedState: string;
    workingTwoHrs: boolean | null;
    idProof: File | null;
    resume: File | null;
}
  
const licensedStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Medical Council of India (NMC)",
];
  
  
  const languageOptions = [
    "English",
    "Malayalam",
    "Hindi",
    "Tamil",
    "Telugu",
    "Kannada",
    "Urdu",
    "Bengali",
    "Gujarati",
    "Punjabi"
  ];
  
  const RegisterForm = () => {
    const {
      register,
      handleSubmit,
      control,
      watch,
      setValue,
      formState: { errors },
    } = useForm<SignupFormInputs>({
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        experience: null,
        languages: [],
        specialization: "",
        licensedState: "",
        registerNo: "",
        workingTwoHrs: null,
        idProof: null,
        resume: null,
      },
    });
  
    const idProof = watch("idProof");
  
    const navigate = useNavigate();
  

    const [loading, setLoading] = useState(false)
    const [specializations, setSpecializations] = useState<ISpecialization[] | []>([])

    useEffect(() => {
        const fetchSpecializations = async () => {
          try {
            setLoading(true);
            const result = await specializationService.getSpecializations();
            setSpecializations(result);
          } catch (error) {
            if (error instanceof Error) {
              toast.error(error.message);
            } else {
              toast.error("Something went wrong");
            }
          } finally {
            setLoading(false);
          }
        };
        fetchSpecializations();
      }, []);
  
    
  
    const handleAddLanguage = (language: string) => {
      const currentLanguages = watch("languages");
      if (!currentLanguages.includes(language)) {
        setValue("languages", [...currentLanguages, language]);
      }
    };
  
    const handleRemoveLanguage = (languageToRemove: string) => {
      const currentLanguages = watch("languages");
      setValue(
        "languages",
        currentLanguages.filter((lang) => lang !== languageToRemove)
      );
    };
  
    const onSubmit = async (data: SignupFormInputs) => {
  
        data.experience = Number(data.experience);
  
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
        const maxSize = 5 * 1024 * 1024;

      
  
      try {
        setLoading(true)
        const formData = new FormData();
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("experience", data.experience.toString());
        formData.append("registerNo", data.registerNo);
        formData.append("specialization", data.specialization);
        formData.append("languages", JSON.stringify(data.languages));
  
        if (data.profilePicture instanceof File) {
          formData.append("profilePicture", data.profilePicture);
        } else {
          console.log("Profile Picture is not a file");
          return;
        }
  
        await doctorsService.addDoctor(formData);
        toast.success("Doctor created successfully!");
  
        navigate("/admin/doctors");
        setLoading(false)
      } catch (error) {
        setLoading(false)
        if (error instanceof Error) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.error("An unknown error occurred");
        }
        log.error("Error signing up doctor", error);
      }
    };
  
    return (
      <Box sx={{ py: 5 }}>
        <Container
          sx={{
            bgcolor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
            
  
            <Box sx={{ width: "90%", my: 2 }}>
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
  
            <Box sx={{ width: "90%", my: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
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
                        message: "Please enter a valid Phone Number",
                      },
                    })}
                    fullWidth
                    type="tel"
                    label="Phone Number"
                    variant="outlined"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                </Grid>
              </Grid>
            </Box>
  
            <Box sx={{ width: "90%", my: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    {...register("experience", {
                      required: "Experience is required",
                      min: {
                        value: 2,
                        message: "Experience Must be more than 1",
                      },
                    })}
                    fullWidth
                    type="number"
                    label="Years of Experience"
                    variant="outlined"
                    error={!!errors.experience}
                    helperText={errors.experience?.message}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    {...register("registerNo", {
                      required: "Registration number is required",
                    })}
                    fullWidth
                    label="Medical Registration Number"
                    variant="outlined"
                    error={!!errors.registerNo}
                    helperText={errors.registerNo?.message}
                  />
                </Grid>
              </Grid>
            </Box>
  
            <Box sx={{ width: "90%", my: 2 }}>
              <TextField
                {...register("specialization", {
                  required: "Specialization is required",
                })}
                select
                fullWidth
                label="Primary Specialization"
                variant="outlined"
                error={!!errors.specialization}
                helperText={errors.specialization?.message}
              >
                {specializations.map((spec) => (
                  <MenuItem key={spec._id} value={spec.name}>
                    {spec.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
  
            <Box sx={{ width: "90%", my: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Languages Spoken
              </Typography>
              <Controller
                name="languages"
                control={control}
                rules={{ required: "Please select at least one language" }}
                render={({ field }) => (
                  <Box>
                    <TextField
                      select
                      fullWidth
                      label="Add Language"
                      variant="outlined"
                      onChange={(e) => handleAddLanguage(e.target.value)}
                      value=""
                      error={!!errors.languages}
                      helperText={errors.languages?.message}
                    >
                      {languageOptions.map((lang) => (
                        <MenuItem key={lang} value={lang}>
                          {lang}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Box
                      sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}
                    >
                      {field.value.map((lang) => (
                        <Chip
                          key={lang}
                          label={lang}
                          onDelete={() => handleRemoveLanguage(lang)}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              />
            </Box>
  
            <Button
              loading={loading}
              disabled={loading}
              fullWidth
              type="submit"
              variant="contained"
              sx={{ py: 2, my: 5, width: "90%", fontSize: "1rem" }}
            >
              Complete Profile
            </Button>
          </Container>
        </Container>
      </Box>
    );
  };
  
  export default RegisterForm;
  