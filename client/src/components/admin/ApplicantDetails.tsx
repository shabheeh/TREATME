import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Alert,
  Skeleton,
  Divider,
} from "@mui/material";
import { IApplicant } from "../../types/doctor/doctor.types";
import applicantService from "../../services/applicant/applicantService";
import { toast } from "sonner";

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
import ConfirmActionModal from "../basics/ConfirmActionModal";

const ApplicantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [applicant, setApplicant] = useState<IApplicant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleReject = async () => {
    try {
      if (!id) return;
      await applicantService.rejectApplicant(id);
      toast.success("Application Rejected");
      setRejectModalOpen(false);
      navigate("/admin/recruitements");
    } catch (error) {
      setRejectModalOpen(false);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          sx={{ mb: 2 }}
        />
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
      <Typography
        variant="h5"
        fontWeight="bold"
        color="text.primary"
        sx={{ mb: 3 }}
      >
        Applicant Details
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "18px",
              mb: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Badge sx={{ mr: 1 }} />
            Personal Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography
              variant="body1"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Email sx={{ mr: 1, color: "primary.main" }} />
              <strong>Email:</strong> {applicant?.email}
            </Typography>
            <Typography
              variant="body1"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Phone sx={{ mr: 1, color: "primary.main" }} />
              <strong>Phone:</strong> {applicant?.phone}
            </Typography>
            <Typography
              variant="body1"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Work sx={{ mr: 1, color: "primary.main" }} />
              <strong>Experience:</strong> {applicant?.experience} years
            </Typography>
            <Typography
              variant="body1"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <LocationOn sx={{ mr: 1, color: "primary.main" }} />
              <strong>Licensed State:</strong> {applicant?.licensedState}
            </Typography>
            <Typography
              variant="body1"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Language sx={{ mr: 1, color: "primary.main" }} />
              <strong>Languages:</strong> {applicant?.languages.join(", ")}
            </Typography>
            <Typography
              variant="body1"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <AssignmentInd sx={{ mr: 1, color: "primary.main" }} />
              <strong>Register No:</strong> {applicant?.registerNo}
            </Typography>
            <Typography
              variant="body1"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Work sx={{ mr: 1, color: "primary.main" }} />
              <strong>Committed to work 2 - 4 hrs:</strong>{" "}
              {applicant?.workingTwoHrs}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "18px",
              mb: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
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
          component="a"
          href={`mailto:${applicant?.email}`}
        >
          Contact
        </Button>
        <Button variant="outlined" onClick={() => setRejectModalOpen(true)}>
          Reject
        </Button>
      </Box>

      <ConfirmActionModal
        open={rejectModalOpen}
        title="Reject Application"
        description="Are you sure you want to reject this Applicant"
        handleClose={() => setRejectModalOpen(false)}
        handleConfirm={handleReject}
      />
    </Box>
  );
};

export default ApplicantDetails;
