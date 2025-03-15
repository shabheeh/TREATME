import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/app/store";
import notificationService from "../services/notification/notificationService";
import { setUnreadCount } from "../redux/features/notification/notificationSlice";

export const useUnreadNotifications = () => {
  const dispatch = useDispatch();
  const unreadCount = useSelector(
    (state: RootState) => state.notification.unreadCount
  );

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const count = await notificationService.getUnreadCounts();
        dispatch(setUnreadCount(count));
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchUnreadCount();
  }, [dispatch]);

  return unreadCount;
};
