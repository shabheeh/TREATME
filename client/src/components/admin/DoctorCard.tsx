import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { IDoctor } from "../../types/doctor/doctor.types";

interface DoctorCardProps {
  doctor: IDoctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardContent sx={{ padding: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Left Section: Avatar and Name */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={doctor.profilePicture}
              sx={{
                width: 64,
                height: 64,
                border: "2px solid #f5f5f5",
              }}
            />
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 600,
                  color: "#1976d2",
                }}
              >
                {doctor.firstName} {doctor.lastName}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: "0.95rem" }}>
                {doctor.specialization.name}
              </Typography>
            </Box>
          </Box>

          {/* Middle Section: Contact Info */}
          <Stack direction="column" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EmailIcon
                fontSize="small"
                sx={{ color: "text.secondary", mr: 0.5 }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: "0.85rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {doctor.email}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PhoneIcon
                fontSize="small"
                sx={{ color: "text.secondary", mr: 0.5 }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: "0.85rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {doctor.phone}
              </Typography>
            </Box>
          </Stack>

          {/* Right Section: Experience */}
          <Box sx={{ textAlign: "right" }}>
            <Typography color="text.secondary" sx={{ fontSize: "0.9rem" }}>
              Experience
            </Typography>
            <Typography
              variant="body1" // Changed from h6 to body1 for smaller size
              sx={{
                fontWeight: 500,
                color: "#424242",
                fontSize: "1.1rem", // Slightly smaller than h6
              }}
            >
              {doctor.experience} years
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
