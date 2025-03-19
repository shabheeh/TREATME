import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Rating,
} from "@mui/material";
import { useState } from "react";


interface FeedbackModalProps {
  reviewModalOpen: boolean;
  onclose: () => void;
  onSubmit: (reviewRating: number, reviewComment: string) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  reviewModalOpen,
  onclose,
  onSubmit,
}) => {
  const [reviewRating, setReviewRating] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState<string>("");

  const handleReviewSubmit = () => {
    if (reviewRating && reviewComment) {
      onSubmit(reviewRating, reviewComment);
      onclose();
    }
  };

  return (
    <Dialog open={reviewModalOpen} onClose={onclose} maxWidth="sm" fullWidth>
      <DialogTitle>How Was Your Appointment?</DialogTitle>
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
            placeholder={`Share your experience`}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onclose}>Later</Button>
        <Button
          onClick={handleReviewSubmit}
          variant="contained"
          color="primary"
          disabled={!reviewRating}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackModal;
