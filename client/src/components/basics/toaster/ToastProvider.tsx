import React, { useState } from "react";
import { Button, Typography, Box, IconButton } from "@mui/material";
import {
  Close as CloseIcon,
  Info as InfoIcon,
  Event as EventIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import { ToasterContext } from "../../../contexts/ToastContext";
import { NotificationItem, ToasterContainer } from "./ToastContainer";
import { Notification } from "../../../types/notification/notification.types";

type NavigationHandler = (route: string) => void;

interface ToasterProviderProps {
  children: React.ReactNode;
  navigationHandler?: NavigationHandler;
}

export const ToasterProvider: React.FC<ToasterProviderProps> = ({
  children,
  navigationHandler = (route: string) =>
    console.log(
      `Navigation to ${route} requested. Provide a navigationHandler prop to enable routing.`
    ),
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp">
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    const timestamp = new Date();

    setNotifications((prev) => [...prev, { ...notification, id, timestamp }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <ToasterContext.Provider
      value={{ notifications, addNotification, removeNotification, clearAll }}
    >
      {children}
      <ToasterContainer>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            sx={{
              "&::before": {
                bgcolor:
                  notification.type === "message"
                    ? "primary.main"
                    : notification.type === "appointment"
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
                {notification.type === "message" && (
                  <MessageIcon color="primary" />
                )}
                {notification.type === "appointment" && (
                  <EventIcon color="secondary" />
                )}
                {notification.type === "general" && <InfoIcon color="info" />}
                <Typography variant="subtitle1" fontWeight="bold">
                  {notification.title}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => removeNotification(notification.id)}
                aria-label="close"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
              {notification.message}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              {notification.actions?.map((action, index) => (
                <Button
                  key={index}
                  size="small"
                  variant={action.primary ? "contained" : "text"}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
              {notification.route && (
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => navigationHandler(notification.route || "/")}
                >
                  View
                </Button>
              )}
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              {notification.timestamp.toLocaleTimeString()}
            </Typography>
          </NotificationItem>
        ))}
      </ToasterContainer>
    </ToasterContext.Provider>
  );
};
