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
import {
  Notifications as NotificationsIcon,
  MarkEmailRead as MarkEmailReadIcon,
  CalendarToday as CalendarTodayIcon,
  Message as MessageIcon,
  Announcement as AnnouncementIcon,
  NotificationsOff as NotificationsOffIcon,
} from "@mui/icons-material";
import { INotification } from "../../../types/notification/notification.types";
import notificationService from "../../../services/notification/notificationService";
import { toast } from "sonner";
import Loading from "../ui/Loading";
import { formatMonthDay, formatTime } from "../../../utils/dateUtils";
import { useDispatch } from "react-redux";
import { setUnreadCount } from "../../../redux/features/notification/notificationSlice";
import { data, useNavigate } from "react-router-dom";
import { useSocket } from "../../../hooks/useSocket";

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState<string | "">("");
  const [limit, setLimit] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, [activeFilter, limit]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const notifications = await notificationService.getNotifications(
        activeFilter,
        limit
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

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      dispatch(setUnreadCount(0));
      fetchNotifications();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "something went wrong"
      );
    }
  };

  // const { socket } = useSocket();

  // useEffect(() => {
  //   if (!socket) return;
  //   socket.on("apppointment-notificatoin", ({ data }) => {
  //     console.log("data")
  //     fetchNotifications();
  //   });
  // }, []);

  const onJoinNowClick = (link: string) => {
    navigate(link);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointments":
        return <CalendarTodayIcon fontSize="small" color="primary" />;
      case "messages":
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
          Notifications
        </Typography>
        <Button
          variant="text"
          size="small"
          startIcon={<MarkEmailReadIcon />}
          color="primary"
          onClick={handleMarkAllRead}
        >
          Mark all read
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Notifications list */}
        <Grid item xs={12} md={9}>
          {notifications.length === 0 && (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              sx={{ height: "60vh", textAlign: "center" }}
            >
              <NotificationsOffIcon sx={{ fontSize: 50, color: "gray" }} />
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                No Notifications
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                You have no new notifications at this time.
              </Typography>
            </Box>
          )}

          {notifications.map((notification) => (
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
                          <Typography variant="subtitle1">
                            {notification.title}
                          </Typography>
                        </Box>
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
                    {notification.link && (
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => onJoinNowClick(notification.link!)}
                        >
                          Join Now
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
          {notifications.length > 0 && (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setLimit((prev) => prev + 15)}
              >
                Load more notifications
              </Button>
            </Box>
          )}
        </Grid>{" "}
        <Grid item xs={12} md={3}>
          <Box sx={{ ml: { md: 4 } }}>
            <FilterOption label="Appointments" value="appointments" />
            {/* <FilterOption label="Messages" value="messages" /> */}
            <FilterOption label="General" value="general" />
            <FilterOption label="All" value="all" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Notifications;
