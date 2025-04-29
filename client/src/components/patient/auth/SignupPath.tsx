import { Box, Stack, Typography } from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import React from "react";

interface SignupPathProps {
  step: number;
}

const SignupPath: React.FC<SignupPathProps> = ({ step }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: { xs: 2, md: 5 },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 2 }}>
        <Stack alignItems="center">
          <PersonAddAltIcon fontSize="medium" color="primary" />
          <Typography
            sx={{
              mt: 1,
              textAlign: "center",
              fontSize: { xs: "0.6rem", sm: "0.7rem" },
              color: "gray",
            }}
          >
            Create Account
          </Typography>
        </Stack>

        <Box
          sx={{
            width: { xs: "30px", sm: "50px", md: "100px" },
            height: "2px",
            bgcolor: "gray",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              right: "-5px",
              top: "-5px",
              width: "10px",
              height: "10px",
              borderTop: "2px solid gray",
              borderRight: "2px solid gray",
              transform: "rotate(45deg)",
            }}
          />
        </Box>

        <Stack alignItems="center">
          <MarkEmailReadOutlinedIcon
            fontSize="medium"
            color={step >= 2 ? "primary" : "secondary"}
          />
          <Typography
            sx={{
              mt: 1,
              textAlign: "center",
              fontSize: { xs: "0.6rem", sm: "0.7rem" },
              color: "gray",
            }}
          >
            Verify Email
          </Typography>
        </Stack>
        <Box
          sx={{
            width: { xs: "30px", sm: "50px", md: "100px" },
            height: "2px",
            bgcolor: "gray",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              right: "-5px",
              top: "-5px",
              width: "10px",
              height: "10px",
              borderTop: "2px solid gray",
              borderRight: "2px solid gray",
              transform: "rotate(45deg)",
            }}
          />
        </Box>

        <Stack alignItems="center">
          <FeedOutlinedIcon
            fontSize="medium"
            color={step >= 3 ? "primary" : "secondary"}
          />
          <Typography
            sx={{
              mt: 1,
              textAlign: "center",
              fontSize: { xs: "0.6rem", sm: "0.7rem" },
              color: "gray",
            }}
          >
            Complete Profile
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default SignupPath;
