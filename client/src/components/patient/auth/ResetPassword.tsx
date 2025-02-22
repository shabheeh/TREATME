import { Box, Container, Typography, TextField, Button } from "@mui/material";

import { useForm } from "react-hook-form";
import authServicePatient from "../../../services/patient/authService";
import { toast } from "sonner";
interface ResetPasswordInputs {
  password: string;
  confirmPassword: string;
}

interface ResetPasswordProps {
  onResetPassword: () => void;
}
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";

const ResetPassword: React.FC<ResetPasswordProps> = ({ onResetPassword }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInputs>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const tempUser = useSelector((state: RootState) => state.tempUser.tempUser);

  const password = watch("password");

  const onSubmit = async (data: ResetPasswordInputs) => {
    try {
      setLoading(true);
      if (!tempUser?._id) {
        throw new Error("User id not found");
      }
      await authServicePatient.resetPassword(tempUser._id, data.password);
      onResetPassword();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
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
            marginBottom: 1,
          }}
        >
          Reset Password
        </Typography>
        <Typography
          variant="body2"
          component="h2"
          textAlign="center"
          gutterBottom
          color="secondary"
          sx={{
            marginTop: 2,
          }}
        >
          Enter your new password
        </Typography>
        <Container
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            m: 10,
          }}
        >
          <TextField
            {...register("password", {
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
            sx={{ py: 2, my: 2, width: "80%", fontSize: "1rem" }}
          >
            Sign Up
          </Button>
        </Container>
      </Container>
    </Box>
  );
};

export default ResetPassword;
