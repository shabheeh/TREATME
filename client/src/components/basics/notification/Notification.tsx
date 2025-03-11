import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MessageIcon from "@mui/icons-material/Message";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import { INotification } from "../../../types/notification/notification.types";
import notificationService from "../../../services/notification/notificationService";
import { toast } from "sonner";
import Loading from "../Loading";
import { formatMonthDay, formatTime } from "../../../utils/dateUtils";

const Notifications = () => {
  // State for active filter
  const [activeFilter, setActiveFilter] = useState<string | "">("");
  const [loading, setLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const notifications = await notificationService.getNotifications(
        activeFilter,
        15
      );
      setNotifications(notifications);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications =
    activeFilter && activeFilter !== "all"
      ? notifications.filter((notif) => notif.type === activeFilter)
      : notifications;

  // const sortedNotifications = [...filteredNotifications].sort((a, b) => {
  //   const priorityOrder = { high: 0, medium: 1, low: 2 };
  //   return priorityOrder[a.priority] - priorityOrder[b.priority];
  // });

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <CalendarTodayIcon fontSize="small" color="primary" />;
      case "message":
        return <MessageIcon fontSize="small" color="secondary" />;
      case "general":
        return <AnnouncementIcon fontSize="small" color="action" />;
      default:
        return <NotificationsIcon fontSize="small" />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#f44336";
      case "medium":
        return "#ff9800";
      case "low":
        return "#8bc34a";
      default:
        return "#757575";
    }
  };

  const FilterOption = ({ label, value }: { label: string; value: string }) => (
    <Box>
      <Box
        sx={{
          py: 1.5,
          px: 2,
          cursor: "pointer",
          color: activeFilter === value ? "primary.main" : "text.secondary",
          fontWeight: activeFilter === value ? "bold" : "normal",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
        onClick={() => setActiveFilter(value)}
      >
        <Typography>{label}</Typography>
      </Box>
      <Divider />
    </Box>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <Box sx={{ maxWidth: 1000, margin: "0 auto", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <NotificationsIcon sx={{ mr: 1 }} />
          Notifications ({filteredNotifications.filter((n) => !n.read).length})
        </Typography>
        <Button
          variant="text"
          size="small"
          startIcon={<MarkEmailReadIcon />}
          color="primary"
        >
          Mark all read
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Notifications list */}
        <Grid item xs={12} md={9}>
          {filteredNotifications.map((notification) => (
            <Card
              key={notification._id}
              variant="outlined"
              sx={{
                mb: 2,
                borderRadius: 2,
                backgroundColor: notification.isRead
                  ? "transparent"
                  : "rgba(25, 118, 210, 0.05)",
                borderLeft: `3px solid ${getPriorityColor(notification.priority)}`,
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box sx={{ mr: 1 }}>
                            {getNotificationIcon(notification.type)}
                          </Box>
                          {/* <Typography variant="subtitle1">
                            {notification.user
                              ? notification.user.name
                              : "System Notification"}
                          </Typography> */}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.title}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {formatMonthDay(notification.createdAt)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(notification.createdAt)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <PriorityIndicator priority={notification.priority} />
                      <Typography variant="caption" color="text.secondary">
                        {notification.priority.charAt(0).toUpperCase() +
                          notification.priority.slice(1)}{" "}
                        priority
                      </Typography>
                    </Box> */}

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        fontStyle: "italic",
                        color: "text.secondary",
                      }}
                    >
                      {notification.message}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
          {filteredNotifications.length > 0 && (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button variant="outlined" size="small">
                Load more notifications
              </Button>
            </Box>
          )}
        </Grid>

        {/* Simple filter list on the right */}
        <Grid item xs={12} md={3}>
          <Box sx={{ ml: { md: 4 } }}>
            <FilterOption label="Appointments" value="appointment" />
            <FilterOption label="Messages" value="message" />
            <FilterOption label="General" value="general" />
            <FilterOption label="All" value="all" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Notifications;
