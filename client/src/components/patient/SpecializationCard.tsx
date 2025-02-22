import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

type SpecializationCardProps = {
  name: string;
  description: string;
  note: string;
  fee: number;
  image: string;
  link: string;
  id: string;
};

const SpecializationCard: React.FC<SpecializationCardProps> = ({
  name,
  description,
  note,
  fee,
  image,
  link,
  id,
}) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(link, {
      state: { specializationId: id, fee: fee } as {
        specializationId: string;
        fee: number;
      },
    });
  };

  return (
    <Card
      sx={{
        width: 280,
        height: 500,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.00)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
        },
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={image}
        alt={`${name} image`}
      />
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            gutterBottom
            component="div"
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              py: 0,
            }}
          >
            {name}
          </Typography>
          <Typography
            gutterBottom
            component="div"
            sx={{
              fontWeight: 500,
              fontSize: "1rem",
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
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
            }}
          >
            {note}
          </Typography>
        </Box>
      </CardContent>
      <Box sx={{ display: "flex", flexDirection: "column", my: 2, mx: 2 }}>
        <Typography
          gutterBottom
          component="div"
          sx={{ fontWeight: 500, fontSize: "1rem", mb: 1 }}
        >
          Fee: ₹{fee}
        </Typography>
        <Button
          onClick={handleGetStarted}
          fullWidth
          sx={{
            borderRadius: "50px",
            "&:hover": {
              transform: "scale(1.0)",
              boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.25)",
            },
          }}
          variant="outlined"
          size="large"
        >
          Get Started
        </Button>
      </Box>
    </Card>
  );
};

export default SpecializationCard;
