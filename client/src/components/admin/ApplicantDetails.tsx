import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
//   Card,
//   CardContent,
  Alert,
  Paper,
  Skeleton,
  Divider,
} from "@mui/material";
import { IApplicant } from "../../types/doctor/doctor.types";
import applicantService from "../../services/applicant/applicantService";
import { toast } from "sonner";
// import Loading from "../basics/Loading";
import { 
    Description,
    Badge,
    Email,
    Phone,
    Work,
    Language,
    AssignmentInd,
    LocationOn,
 } from "@mui/icons-material";


const ApplicantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [applicant, setApplicant] = useState<IApplicant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        setLoading(true);
        const result = await applicantService.getApplicant(id!);
        setApplicant(result);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
          setError(error.message);
        } else {
          toast.error("Something went wrong");
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplicant();
  }, [id]);

  const openFileInNewTab = (fileUrl: string | undefined) => {
    if (fileUrl) {
      const newTab = window.open(fileUrl, "_blank");
      if (newTab) {
        newTab.focus();
      }
    } else {
      toast.error("File URL is not available");
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
  <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 3}}>
        Applicant Details
      </Typography>

  <Grid container spacing={4}>
    {/* Personal Information Section */}
    <Grid item xs={12} md={6}>
      <Typography  sx={{ fontWeight: "bold", fontSize: "18px", mb: 2, display: "flex", alignItems: "center" }}>
        <Badge sx={{ mr: 1 }} />
        Personal Information
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
          <Email sx={{ mr: 1, color: "primary.main" }} />
          <strong>Email:</strong> {applicant?.email}
        </Typography>
        <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
          <Phone sx={{ mr: 1, color: "primary.main" }} />
          <strong>Phone:</strong> {applicant?.phone}
        </Typography>
        <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
          <Work sx={{ mr: 1, color: "primary.main" }} />
          <strong>Experience:</strong> {applicant?.experience} years
        </Typography>
        <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
          <LocationOn sx={{ mr: 1, color: "primary.main" }} />
          <strong>Licensed State:</strong> {applicant?.licensedState}
        </Typography>
        <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
          <Language sx={{ mr: 1, color: "primary.main" }} />
          <strong>Languages:</strong> {applicant?.languages.join(", ")}
        </Typography>
        <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
          <AssignmentInd sx={{ mr: 1, color: "primary.main" }} />
          <strong>Register No:</strong> {applicant?.registerNo}
        </Typography>
        <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
          <Work sx={{ mr: 1, color: "primary.main" }} />
          <strong>Committed to work 2 - 4 hrs:</strong> {applicant?.workingTwoHrs}
        </Typography>
      </Box>
    </Grid>

    {/* Documents Section */}
    <Grid item xs={12} md={6}>
    <Typography  sx={{ fontWeight: "bold", fontSize: "18px", mb: 2, display: "flex", alignItems: "center" }}>

        <Description sx={{ mr: 1 }} />
        Documents
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          variant="text"
          startIcon={<Description />}
          onClick={() => openFileInNewTab(applicant?.idProof)}
          disabled={!applicant?.idProof}
          sx={{ textTransform: "none", justifyContent: "flex-start" }}
        >
          View ID Proof
        </Button>
        <Button
          variant="text"
          startIcon={<Description />}
          onClick={() => openFileInNewTab(applicant?.resume)}
          disabled={!applicant?.resume}
          sx={{ textTransform: "none", justifyContent: "flex-start" }}
        >
          View Resume
        </Button>
      </Box>
    </Grid>
  </Grid>

  {/* Accept & Reject Buttons at Bottom Right */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "flex-end",
      gap: 2,
      mt: 4,
    }}
  >
    <Button
  variant="contained"
  color="success"
  component="a"
  href={`mailto:${applicant?.email}?subject=Application Accepted&body=Dear ${applicant?.firstName},%0D%0A%0D%0AWe are pleased to inform you that your application has been accepted.`}
>
  Accept
</Button>
    <Button variant="outlined" >Reject</Button>
  </Box>
</Box>

  );
};

export default ApplicantDetails;