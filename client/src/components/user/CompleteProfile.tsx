import { 
    Box, 
    Container, 
    Typography, 
    TextField, 
    Button,
    ToggleButton,
    ToggleButtonGroup,
    MenuItem,
    Grid
  } from "@mui/material"
  import SignupPath from "./SignupPath";
  import React, { useEffect, useState } from "react"
  import { useForm, Controller } from "react-hook-form";
  import log from 'loglevel';
// import { IUser } from "../../types/user/authTypes";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/app/store";
import authServiceUser from "../../services/user/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


  interface SignupFormInputs {
    firstName: string;
    lastName: string;
    phone: string;
    gender: "male" | "female" | "";
    birthDay: string;
    birthMonth: string;
    birthYear: string;
  }

interface CompleteProfileProps {
  isPartialUser?: boolean
}

  
  const CompleteProfile: React.FC<CompleteProfileProps> = ({ isPartialUser }) => {
    const [availableDays, setAvailableDays] = useState<string[]>([]);
    const tempUser = useSelector((state: RootState) => state.tempUser.tempUser)
    
    const navigate = useNavigate()

    const { 
      register, 
      handleSubmit,
      control,
      watch,
      setValue,
      formState: { errors } 
    } = useForm<SignupFormInputs>({
      defaultValues: {
        firstName: tempUser?.firstName || "",
        lastName: tempUser?.lastName || "",
        phone: '',
        gender: '',
        birthDay: '',
        birthMonth: '',
        birthYear: ''
      }
    });
  
    const months = Array.from({ length: 12 }, (_, i) => ({
      value: (i + 1).toString().padStart(2, '0'),
      label: new Date(2000, i).toLocaleString('default', { month: 'long' })
    }));
    
    const currentYear = new Date().getFullYear();
    const years = Array.from(
      { length: 100 }, 
      (_, i) => (currentYear - i).toString()
    );
  
    const selectedMonth = watch('birthMonth');
    const selectedYear = watch('birthYear');
    const selectedDay = watch('birthDay');
  

    const isLeapYear = (year: number): boolean => {
      return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    };

    const getDaysInMonth = (month: string, year: string): number => {
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);
      
      if (monthNum === 2) { 
        return isLeapYear(yearNum) ? 29 : 28;
      }
      
      return [4, 6, 9, 11].includes(monthNum) ? 30 : 31;
    };
  

    useEffect(() => {
      if (selectedMonth && selectedYear) {
        const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
        const days = Array.from(
          { length: daysInMonth }, 
          (_, i) => (i + 1).toString().padStart(2, '0')
        );
        setAvailableDays(days);

        if (selectedDay && parseInt(selectedDay, 10) > daysInMonth) {
            setValue('birthDay', '');
        }
      }
    }, [selectedMonth, selectedYear, control, selectedDay]);
  

    const validateAge = (year: string, month: string, day: string) => {
      if (!year || !month || !day) return true;
      
      const birthDate = new Date(
        parseInt(year), 
        parseInt(month) - 1, 
        parseInt(day)
      );
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    };
  
    const onSubmit = async (data: SignupFormInputs) => {
      if (!validateAge(data.birthYear, data.birthMonth, data.birthDay)) {
        return;
      }
      log.info(data);
      if(!tempUser?.email) {
        log.error('error signin up user')
        return
      }

      if(!data.gender) {
        log.error('error signin up user')
        return
      }

      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: tempUser.email,
        phone: data.phone,
        gender: data.gender,
        dateOfBirth: data.birthDay + "-" +  data.birthMonth + "-" + data.birthYear
      }
      
      console.log(userData)

      try {
        if (!isPartialUser) {
          await authServiceUser.signUp(userData)
          navigate('/signin')
        }else {
          await authServiceUser.completeProfile(userData)
          navigate("/patient")
        }
        
        
        log.info("user singued success")
      } catch (error) {
        if(error instanceof Error) {
          toast.error(error.message)
        }
        log.error("error signinup user", error)
      }

    };
  
    return (
        <Box sx={{ py: 10 }}>
          <Container
            sx={{
              bgcolor: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: '45%'
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
              Complete Your Profile
            </Typography>
            <SignupPath  step={3} />
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
                      message: "Please enter a valid First Name"
                    }
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
                      message: "Please enter a valid Last Name"
                    }
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
              <TextField
                {...register("phone", { 
                  required: "Phone Number is required",
                  pattern: {
                    value: /^[2-9]\d{9}$/,
                    message: "Please enter a valid Phone Number"
                  }
                })}
                fullWidth
                type="tel"
                label="Phone Number"
                variant="outlined"
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
              </Box>
  
     
              <Box sx={{ width: "90%", my: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Gender
                </Typography>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: "Please select a gender" }}
                  render={({ field }) => (
                    <ToggleButtonGroup
                      {...field}
                      exclusive
                      fullWidth
                      color="primary"
                    >
                      <ToggleButton value="male" sx={{ py: 1 }}>
                        Male
                      </ToggleButton>
                      <ToggleButton value="female" sx={{ py: 1 }}>
                        Female
                      </ToggleButton>
                    </ToggleButtonGroup>
                  )}
                />
                {errors.gender && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                    {errors.gender.message}
                  </Typography>
                )}
              </Box>
  
              <Box sx={{ width: "90%", my: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Date of Birth
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Controller
                      name="birthMonth"
                      control={control}
                      rules={{ required: "Required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Month"
                          error={!!errors.birthMonth}
                          helperText={errors.birthMonth?.message}
                        >
                          {months.map((month) => (
                            <MenuItem key={month.value} value={month.value}>
                              {month.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Controller
                      name="birthDay"
                      control={control}
                      rules={{ 
                        required: "Required",
                        validate: {
                          validDay: (value) => {
                            if (!selectedMonth || !selectedYear) return true;
                            const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
                            return parseInt(value) <= daysInMonth || 
                              "Invalid day for selected month and year";
                          }
                        }
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Day"
                          error={!!errors.birthDay}
                          helperText={errors.birthDay?.message}
                          disabled={!selectedMonth || !selectedYear}
                        >
                          {availableDays.map((day) => (
                            <MenuItem key={day} value={day}>
                              {day}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Controller
                      name="birthYear"
                      control={control}
                      rules={{ 
                        required: "Required",
                        validate: {
                          validAge: (value) => {
                            if (!selectedMonth || !selectedDay) return true;
                            return validateAge(value, selectedMonth, selectedDay) || 
                              "Must be at least 18 years old";
                          }
                        }
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Year"
                          error={!!errors.birthYear}
                          helperText={errors.birthYear?.message}
                        >
                          {years.map((year) => (
                            <MenuItem key={year} value={year}>
                              {year}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
  
              <Button 
                fullWidth
                type="submit"
                variant="contained"  
                sx={{ py: 2, my: 5, width: '90%', fontSize: '1rem' }}
              >
                Complete Profile
              </Button>
            </Container>
          </Container>
        </Box>
    );
  };
  
  export default CompleteProfile;