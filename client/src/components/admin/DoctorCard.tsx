import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  useTheme,
  Button,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { IDoctor } from "../../types/doctor/doctor.types";
import { useNavigate } from "react-router-dom";

interface DoctorCardProps {
  doctor: IDoctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        <Avatar
          src={doctor.profilePicture}
          sx={{
            width: 56,
            height: 56,
            mr: 2,
          }}
        />
        <Box>
          <Typography variant="h6" component="h2">
            {doctor.firstName} {doctor.lastName}
          </Typography>
          <Typography variant="body2">{doctor.specialization.name}</Typography>
        </Box>
      </Box>
      <CardContent>
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <EmailIcon sx={{ fontSize: 18, color: "primary.main", mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {doctor.email}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PhoneIcon sx={{ fontSize: 18, color: "primary.main", mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {doctor.phone}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 2,
          }}
        >
          <Button
            onClick={() => navigate(`/doctors/${doctor._id}`)}
            variant="outlined"
            size="small"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            sx={{ borderRadius: 2 }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
