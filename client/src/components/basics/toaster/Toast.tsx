import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertTitle,
  Snackbar,
  Box,
  Button,
  IconButton,
  styled,
} from "@mui/material";
import {
  Close as CloseIcon,
  Message as MessageIcon,
  Event as CalendarIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

export type NotificationType =
  | "message"
  | "appointment"
  | "info"
  | "warning"
  | "success";

export interface ToastProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose: () => void;
}

const StyledAlert = styled(Alert)(({ theme, severity }) => ({
  borderRadius: theme.shape.borderRadius,
  borderLeftWidth: 4,
  borderLeftStyle: "solid",
  borderColor:
    severity === "success"
      ? theme.palette.success.main
      : severity === "warning"
        ? theme.palette.warning.main
        : theme.palette.primary.main,
  "& .MuiAlert-icon": {
    color:
      severity === "success"
        ? theme.palette.success.main
        : severity === "warning"
          ? theme.palette.warning.main
          : theme.palette.primary.main,
  },
  width: "100%",
  boxShadow: theme.shadows[3],
}));

const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  duration = 5000,
  action,
  onClose,
}) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 300);
    }
  };

  const getSeverity = () => {
    switch (type) {
      case "warning":
        return "warning";
      case "success":
        return "success";
      case "message":
      case "appointment":
      case "info":
      default:
        return "info";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "message":
        return <MessageIcon />;
      case "appointment":
        return <CalendarIcon />;
      case "info":
        return <InfoIcon />;
      case "warning":
        return <WarningIcon />;
      case "success":
        return <CheckCircleIcon />;
      default:
        return <InfoIcon />;
    }
  };

  return (
    <Snackbar open={open} sx={{ position: "static", transform: "none", mb: 2 }}>
      <StyledAlert
        severity={getSeverity()}
        icon={getIcon()}
        action={
          <Box>
            {action && (
              <Button
                color="primary"
                size="small"
                onClick={action.onClick}
                sx={{ mr: 1 }}
              >
                {action.label}
              </Button>
            )}
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </StyledAlert>
    </Snackbar>
  );
};

export default Toast;
