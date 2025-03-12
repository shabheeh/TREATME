import React, { useState } from "react";
import { ToasterContext } from "../../../contexts/ToastContext";
import { ToasterContainer, NotificationItem } from "./ToastContainer";
import { INotification } from "../../../types/notification/notification.types";
import { formatTime } from "../../../utils/dateUtils";
import { Typography, Box, IconButton } from "@mui/material";
import {
  Close as CloseIcon,
  Info as InfoIcon,
  Event as EventIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
type NavigationHandler = (route: string) => void;

interface ToasterProviderProps {
  children: React.ReactNode;
  navigationHandler?: NavigationHandler;
}

export const ToasterProvider: React.FC<ToasterProviderProps> = ({
  children,
}) => {
  const [currentNotification, setCurrentNotification] =
    useState<INotification | null>(null);

  const showToast = (notification: INotification) => {
    setCurrentNotification(notification);

    setTimeout(() => {
      setCurrentNotification(null);
    }, 3000);
  };

  return (
    <ToasterContext.Provider
      value={{
        showNotification: showToast,
      }}
    >
      {children}
      <ToasterContainer>
        {currentNotification && (
          <NotificationItem
            key={currentNotification._id}
            sx={{
              "&::before": {
                bgcolor:
                  currentNotification.type === "messages"
                    ? "primary.main"
                    : currentNotification.type === "appointments"
                      ? "secondary.main"
                      : "info.main",
              },
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center" gap={1}>
                {currentNotification.type === "messages" && (
                  <MessageIcon color="primary" />
                )}
                {currentNotification.type === "appointments" && (
                  <EventIcon color="secondary" />
                )}
                {currentNotification.type === "general" && (
                  <InfoIcon color="info" />
                )}
                <Typography variant="subtitle1" fontWeight="bold">
                  {currentNotification.title}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => setCurrentNotification(null)}
                aria-label="close"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
              {currentNotification.message}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {formatTime(currentNotification.createdAt)}
            </Typography>
          </NotificationItem>
        )}
      </ToasterContainer>
    </ToasterContext.Provider>
  );
};
