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
import { toast } from "sonner";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/app/store";
import authServicePatient from "../../services/patient/authService";
import doctorAuthService from "../../services/doctor/authService";

interface ChangePasswordInputs {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Security = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInputs>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const userRole = useSelector((state: RootState) => state.auth.role);
  const [loading, setLoading] = useState<boolean>(false);
  const password = watch("newPassword");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  const onSubmit = async (data: ChangePasswordInputs) => {
    try {
      setLoading(true);
      if (!userRole) {
        throw new Error("user not found");
      }
      if (userRole === "patient") {
        await authServicePatient.changePassword(
          data.currentPassword,
          data.newPassword
        );
      } else if (userRole === "doctor") {
        await doctorAuthService.changePassword(
          data.currentPassword,
          data.newPassword
        );
      }

      reset();
      toast.success("password changed successully");

      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
    }
  };

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword((prev) => !prev);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };
  return (
    <Box sx={{ py: 1 }}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          color: "teal",
          marginTop: 5,
          marginBottom: 1,
        }}
      >
        Change Password
      </Typography>
      <Typography
        variant="body2"
        component="h2"
        gutterBottom
        color="secondary"
        sx={{
          marginTop: 2,
        }}
      >
        Change your previous password with new one
      </Typography>
      <Container
        maxWidth="md"
        sx={{
          bgcolor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "start",
        }}
      >
        <Container
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "start",
            m: 10,
          }}
        >
          <TextField
            {...register("currentPassword", {
              required: "Current password is required",
            })}
            type={showCurrentPassword ? "text" : "password"}
            label="Current Password"
            variant="outlined"
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
            sx={{ width: "80%", mx: "auto", my: "10px" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleCurrentPasswordVisibility}
                    edge="end"
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            {...register("newPassword", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
              },
            })}
            type={showNewPassword ? "text" : "password"}
            label="New Password"
            variant="outlined"
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            sx={{ width: "80%", mx: "auto", my: "10px" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleNewPasswordVisibility} edge="end">
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            type="password"
            label="Confirm Password"
            variant="outlined"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            sx={{ width: "80%", margin: "10px auto" }}
          />
          <Button
            loading={loading}
            disabled={loading}
            type="submit"
            variant="contained"
          >
            Submit
          </Button>
        </Container>
      </Container>
    </Box>
  );
};

export default Security;
