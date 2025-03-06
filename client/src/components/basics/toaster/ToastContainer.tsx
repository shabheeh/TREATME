import { Box, Paper } from "@mui/material";
import { styled } from "@mui/system";


export const ToasterContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  maxWidth: "300px",
  width: "100%",
}));

export const NotificationItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "4px",
  },
}));
