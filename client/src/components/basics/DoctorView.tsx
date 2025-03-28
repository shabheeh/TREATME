import {
  Box,
  Typography,
  Avatar,
  Grid,
  Button,
  Container,
  List,
  ListItem,
  Divider,
  Paper,
  Rating,
  TextField,
  Skeleton,
  Alert,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import doctorService from "../../services/doctor/doctorService";
import reviewService from "../../services/review/reviewService";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/app/store";
import { IReviewPopulated } from "../../types/review/review.types";
import { IDoctor } from "../../types/doctor/doctor.types";
import Loading from "./ui/Loading";

const DoctorProfile = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<IDoctor | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviewDialogOpen, setReviewDialogOpen] = useState<boolean>(false);
  const [reviewRating, setReviewRating] = useState<number | null>(0);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviews, setReviews] = useState<IReviewPopulated[]>([]);
  const [reveiwsLoading, setReviewsLoading] = useState<boolean>(true);
  const [existingReview, setExistingReview] = useState<IReviewPopulated | null>(
    null
  );
  const currentPatient = useSelector(
    (state: RootState) => state.user.currentUser
  );

  const userRole = useSelector((state: RootState) => state.auth.role);

  const fetchDoctor = async () => {
    if (!doctorId) {
      setError(true);
      return;
    }
    try {
      const doctor = await doctorService.getDoctor(doctorId);
      setDoctor(doctor);

      if (currentPatient && reviews.length > 1) {
        const userReview = reviews.find(
          (review) => review.patient._id === currentPatient._id
        );
        if (userReview) {
          setExistingReview(userReview);
          setReviewRating(userReview.rating);
          setReviewComment(userReview.comment);
        }
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      if (!doctorId) {
        return null;
      }
      const reviews = await reviewService.getDoctorReviews(doctorId);
      setReviews(reviews);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
    fetchReviews();
  }, []);

  const handleReviewSubmit = async () => {
    if (!doctor || !currentPatient || !reviewRating) return;

    try {
      // Add new review
      await reviewService.addOrUpdateReview({
        doctor: doctor._id,
        patient: currentPatient._id,
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success("Review added successfully");
      fetchReviews();

      setReviewDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit review"
      );
    }
  };

  const averageRating = reviews?.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  if (loading) {
    return <DoctorProfileSkeleton />;
  }

  if (error || !doctor) {
    return (
      <Container sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3, color: "#0288d1" }}
          href="/doctors"
        >
          Back
        </Button>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load doctor profile. The doctor may not exist or there was a
          connection issue.
        </Alert>
        {userRole === "patient" ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/doctors")}
          >
            Browse Doctors
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/admin/doctors")}
          >
            Browse Doctors
          </Button>
        )}
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Avatar
                src={doctor.profilePicture}
                alt={doctor.firstName}
                sx={{ width: 120, height: 120, mb: 2 }}
              >
                {!doctor.profilePicture && <PersonIcon fontSize="large" />}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {doctor.firstName} {doctor.lastName}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                {doctor.specialization.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Rating value={averageRating} precision={0.5} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({reviews.length} reviews)
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Biography
              </Typography>
              <Typography variant="body1" paragraph>
                {doctor.biography}
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Specialties
              </Typography>
              <List dense>
                {doctor.specialties.map((specialty, index) => (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <Typography variant="body2">• {specialty}</Typography>
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Licensed State(s)
              </Typography>
              <Typography variant="body2">• {doctor.licensedState}</Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Languages Spoken
              </Typography>
              <Typography variant="body2">
                • {doctor.languages.join(", ")}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                License No (Registration No):
              </Typography>
              <Typography variant="body2">{doctor.registerNo}</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={1}>
          <Divider orientation="vertical" sx={{ height: "100%", my: 1 }} />
        </Grid>

        <Grid item xs={12} md={4}>
          {reveiwsLoading ? (
            <Loading />
          ) : (
            <Box sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Patient Reviews</Typography>
                {userRole === "patient" && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setReviewDialogOpen(true)}
                  >
                    {existingReview ? "Update Your Review" : "Write a Review"}
                  </Button>
                )}
              </Box>

              <Divider sx={{ mb: 3 }} />

              {reviews.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 3 }}
                >
                  {userRole === "patient"
                    ? `No reviews yet. Be the first to review Dr. ${doctor.lastName}`
                    : `Now reviews yet`}
                </Typography>
              ) : (
                <Box sx={{ maxHeight: 500, overflow: "auto" }}>
                  {reviews.map((review, index) => (
                    <Box key={review._id || index}>
                      <Box sx={{ mb: 2, px: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="subtitle2">
                            {review.patient
                              ? `${review.patient.firstName} ${review.patient.lastName}`
                              : "Anonymous Patient"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(review.updatedAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Rating
                          value={review.rating}
                          size="small"
                          readOnly
                          sx={{ my: 1 }}
                        />
                        <Typography variant="body2">
                          {review.comment}
                        </Typography>
                      </Box>
                      {index < reviews.length - 1 && <Divider sx={{ my: 2 }} />}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Grid>
      </Grid>

      <Dialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {existingReview ? "Update Your Review" : "Write a Review"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography>Your Rating</Typography>
            <Rating
              name="rating"
              value={reviewRating}
              onChange={(_, newValue) => setReviewRating(newValue)}
              size="large"
            />
            <TextField
              label="Your Review"
              multiline
              rows={4}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              fullWidth
              placeholder={`Share your experience with Dr. ${doctor.firstName}`}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleReviewSubmit}
            variant="contained"
            color="primary"
            disabled={!reviewRating}
          >
            {existingReview ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

// Skeleton loading component
const DoctorProfileSkeleton = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, color: "#0288d1" }}
        disabled
      >
        Back
      </Button>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Skeleton
                variant="circular"
                width={120}
                height={120}
                sx={{ mb: 2 }}
              />
              <Skeleton variant="text" width={200} height={40} />
              <Skeleton variant="text" width={150} height={30} />
              <Skeleton variant="text" width={120} height={30} />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Skeleton variant="text" width={150} height={30} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="90%" height={20} />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Skeleton variant="text" width={150} height={30} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="70%" height={20} />
              <Skeleton variant="text" width="50%" height={20} />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Skeleton variant="text" width={150} height={30} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="40%" height={20} />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Skeleton variant="text" width={150} height={30} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={20} />
            </Box>

            <Box>
              <Skeleton variant="text" width={200} height={30} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="30%" height={20} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Skeleton variant="text" width={120} height={30} />
              <Skeleton variant="rectangular" width={120} height={36} />
            </Box>

            <Divider sx={{ mb: 2 }} />

            {[1, 2, 3].map((index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Skeleton variant="text" width={100} height={24} />
                    <Skeleton variant="text" width={80} height={20} />
                  </Box>
                  <Skeleton
                    variant="text"
                    width={120}
                    height={24}
                    sx={{ my: 1 }}
                  />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="90%" height={20} />
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DoctorProfile;
