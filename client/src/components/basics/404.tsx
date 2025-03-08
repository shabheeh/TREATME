import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import Navbar from "./Navbar";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f7f7f7",
          pt: 8,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            maxWidth: "500px",
            mx: "auto",
            px: 2,
            py: 4,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: "1.25rem",
              color: "#a0aec0",
              borderRight: "1px solid #cbd5e0",
              pr: 2,
            }}
          >
            404
          </Typography>
          <Typography
            variant="h5"
            sx={{
              ml: 2,
              fontSize: "1.25rem",
              color: "#a0aec0",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Not Found
          </Typography>
        </Box>

        {/* Back Button */}
        <Box sx={{ position: "absolute", bottom: 16, textAlign: "center" }}>
          <Button
            onClick={handleBack}
            sx={{
              textTransform: "uppercase",
              fontSize: "0.875rem",
              color: "#a0aec0",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
                color: "#718096",
              },
            }}
          >
            Back
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default NotFoundPage;
