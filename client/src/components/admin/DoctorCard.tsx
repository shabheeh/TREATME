import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Stack,
  Chip,
  IconButton,
  Divider
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star";

interface DoctorCardProps {
  name: string;
  specialty: string;
  email: string;
  phone: string;
  experience: number;
  totalAppointments: number;
  todayAppointments: number;
  rating: number;
  nextAvailable: string;
  imageUrl?: string;
  status?: string;
}

const DoctorCard = ({
  name,
  specialty,
  email,
  phone,
  experience,
  totalAppointments,
  todayAppointments,
  rating,
  nextAvailable,
  imageUrl,
  status = "In Consultation"
}: DoctorCardProps) => {
  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Avatar src={imageUrl} sx={{ width: 64, height: 64 }} />
            <Box>
              <Typography variant="h6" component="div">
                {name}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {specialty}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <EmailIcon
                    fontSize="small"
                    sx={{ color: "text.secondary", mr: 0.5 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {email}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PhoneIcon
                    fontSize="small"
                    sx={{ color: "text.secondary", mr: 0.5 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {phone}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end"
            }}
          >
            <Chip label={status} color="warning" size="small" sx={{ mb: 1 }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <StarIcon sx={{ color: "#FFD700", fontSize: "20px" }} />
              <Typography variant="h6">{rating}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Next available: {nextAvailable}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Box>
            <Typography color="text.secondary">Experience</Typography>
            <Typography variant="h6">{experience} years</Typography>
          </Box>
          <Box>
            <Typography color="text.secondary">Total Appointments</Typography>
            <Typography variant="h6" align="center">
              {totalAppointments}
            </Typography>
          </Box>
          <Box>
            <Typography color="text.secondary">Today's Schedule</Typography>
            <Typography variant="h6" align="center">
              {todayAppointments} appointments
            </Typography>
          </Box>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
