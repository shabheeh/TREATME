import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { AccessTime as AccessTimeIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/app/store";

type SpecializationCardProps = {
  name: string;
  description: string;
  note: string;
  fee: number;
  image: string;
  id: string;
  duration: number;
};

const SpecializationCard: React.FC<SpecializationCardProps> = ({
  name,
  description,
  note,
  fee,
  image,
  id,
  duration,
}) => {
  const navigate = useNavigate();

  const userRole = useSelector((state: RootState) => state.auth.role);

  const handleGetStarted = () => {
    navigate("/reason", {
      state: { specializationId: id } as {
        specializationId: string;
      },
    });
  };
  return (
    <Card
      sx={{
        width: 280,
        height: 520,
        display: "flex",
        flexDirection: "column",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.12)",
      }}
    >
      <CardMedia
        component="img"
        height="120"
        image={image}
        alt={`${name} image`}
        sx={{
          objectFit: "cover",
        }}
      />

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
          gap: 1,
        }}
      >
        <Box sx={{ mb: 1 }}>
          <Typography
            component="h2"
            sx={{
              fontWeight: 600,
              fontSize: "1rem",
              lineHeight: 1.2,
              mb: 0.75,
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </Typography>

          <Typography
            component="div"
            sx={{
              fontWeight: 500,
              fontSize: "0.875rem",
              lineHeight: 1.3,
              color: "#424242",
              height: "2.6em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
            }}
          >
            {description}
          </Typography>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.8rem",
              lineHeight: 1.4,
              color: "#616161",
              overflow: "auto",
              maxHeight: "100%",
              pr: 0.5,
              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#9e9e9e",
                borderRadius: "4px",
              },
            }}
          >
            {note}
          </Typography>
        </Box>
      </CardContent>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 2,
          pt: 1,
          bgcolor: "#f9f9f9",
          borderTop: "1px solid #eeeeee",
        }}
      >
        <Typography
          component="div"
          sx={{
            fontWeight: 500,
            fontSize: "0.9rem",
            color: "#333333",
          }}
        >
          Fee: ₹{fee}
        </Typography>
        <Typography
          component="div"
          sx={{
            fontWeight: 500,
            fontSize: "0.9rem",
            color: "#333333",
            display: "flex",
            alignItems: "center",
            mb: 1,
          }}
        >
          <AccessTimeIcon sx={{ fontSize: "0.9rem", mr: 0.5 }} />
          {duration} Minutes
        </Typography>
        {userRole === "patient" ? (
          <Button
            fullWidth
            onClick={handleGetStarted}
            sx={{
              borderRadius: "4px",
              py: 0.75,
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
            variant="outlined"
            size="medium"
          >
            Get Started
          </Button>
        ) : (
          <Button
            fullWidth
            href={`/admin/specializations/edit/${id}`}
            sx={{
              borderRadius: "4px",
              py: 0.75,
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
            variant="outlined"
            size="medium"
          >
            Edit
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default SpecializationCard;
