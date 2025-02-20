import { Avatar, Box, Button, Typography, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import React from "react";

type ProfileProps = {
  handleEditProfile: () => void;
  handleEditAddress: () => void;
};

const Profile: React.FC<ProfileProps> = ({
  handleEditProfile,
  handleEditAddress
}) => {
  const patient = useSelector((state: RootState) => state.user.patient);
  const currentPatient = useSelector(
    (state: RootState) => state.user.currentUser
  );

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4
        }}
      >
        <Avatar
          src={currentPatient?.profilePicture || "/api/placeholder/48/48"}
          alt={currentPatient?.firstName}
          sx={{
            width: 100,
            height: 100,
            mb: 2,
            border: "3px solid primary.main"
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {currentPatient?.firstName} {currentPatient?.lastName}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {patient?.email}
        </Typography>
      </Box>

      <Grid container spacing={6}>
        <Grid item xs={12} md={currentPatient?._id !== patient?._id ? 8 : 6}>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                borderBottom: "1px solid grey",
                pb: 1
              }}
            >
              <Typography variant="h6">Personal Information</Typography>
              <Button variant="text" onClick={handleEditProfile}>
                Edit
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography>
                <strong>Date of Birth:</strong>{" "}
                {new Date(
                  currentPatient?.dateOfBirth ?? new Date()
                ).toLocaleDateString("en-GB") || "Not Provided"}
              </Typography>
              <Typography>
                <strong>Gender:</strong>{" "}
                {currentPatient?.gender || "Not specified"}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {patient?.phone || "Not available"}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {currentPatient?._id === patient?._id && (
          <Grid item xs={12} md={6}>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  borderBottom: "1px solid grey",
                  pb: 1
                }}
              >
                <Typography variant="h6">Address</Typography>
                <Button variant="text" onClick={handleEditAddress}>
                  Edit
                </Button>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography>
                  <strong>Street:</strong>{" "}
                  {patient?.address?.street || "Not provided"}
                </Typography>
                <Typography>
                  <strong>Landmark:</strong>{" "}
                  {patient?.address?.landmark || "Not provided"}
                </Typography>
                <Typography>
                  <strong>City:</strong>{" "}
                  {patient?.address?.city || "Not specified"}
                </Typography>
                <Typography>
                  <strong>State:</strong> {patient?.address?.state || "N/A"}
                </Typography>
                <Typography>
                  <strong>Postal Code:</strong>{" "}
                  {patient?.address?.pincode || "N/A"}
                </Typography>
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Profile;
