import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Home,
  Message,
  People,
  MedicalServices,
  PersonSearch,
  Logout,
} from "@mui/icons-material";

import { FaUserDoctor } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { signOut } from "../../redux/features/auth/authSlice";
import { clearUser } from "../../redux/features/user/userSlice";

const drawerWidth = 250;

const menuItems = [
  { text: "Dashboard", icon: <Home />, path: "/admin/dashboard" },
  { text: "Patients", icon: <People />, path: "/admin/patients" },
  { text: "Doctors", icon: <FaUserDoctor size={23} />, path: "/admin/doctors" },
  { text: "Messages", icon: <Message />, path: "/admin/messages" },
  {
    text: "Specializations",
    icon: <MedicalServices />,
    path: "/admin/specializations",
  },
  {
    text: "Applications",
    icon: <PersonSearch />,
    path: "/admin/applications",
  },
  {
    text: "Revenue Report",
    icon: <PersonSearch />,
    path: "/admin/revenue",
  },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const handleNavigate = (path: string) => {
    navigate(path);
    if (!isLargeScreen) {
      onClose();
    }
  };

  const handleSignout = () => {
    dispatch(signOut());
    dispatch(clearUser());
  };

  const drawerContent = (
    <List sx={{ pt: 2 }}>
      {menuItems.map((item) => (
        <ListItem
          key={item.text}
          disablePadding
          sx={{
            px: 2,
            py: 0.5,
          }}
        >
          <ListItemButton
            selected={location.pathname.startsWith(item.path)}
            onClick={() => handleNavigate(item.path)}
            sx={{
              borderRadius: "8px",
              justifyContent: "center",
              minHeight: "48px",
              position: "relative",
              "&.Mui-selected": {
                backgroundColor: "#e6fffa",
                border: "1px solid #00897b",
                "&:hover": {
                  backgroundColor: "#e6fffa",
                },
              },
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "95%",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: "40px",
                  color: location.pathname.startsWith(item.path)
                    ? "#00897b"
                    : "rgba(0, 0, 0, 0.54)",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  "& .MuiTypography-root": {
                    fontWeight: location.pathname.startsWith(item.path)
                      ? 600
                      : 400,
                    color: location.pathname.startsWith(item.path)
                      ? "#00897b"
                      : "inherit",
                  },
                }}
              />
            </Box>
          </ListItemButton>
        </ListItem>
      ))}
      <ListItem
        disablePadding
        sx={{
          px: 2,
          py: 0.5,
        }}
      >
        <ListItemButton
          onClick={handleSignout}
          sx={{
            borderRadius: "8px",
            justifyContent: "center",
            minHeight: "48px",
            position: "relative",
            "&.Mui-selected": {
              backgroundColor: "#e6fffa",
              border: "1px solid #00897b",
              "&:hover": {
                backgroundColor: "#e6fffa",
              },
            },
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "95%",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: "40px",
                color: "rgba(0, 0, 0, 0.54)",
              }}
            >
              <Logout />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              sx={{
                "& .MuiTypography-root": {
                  fontWeight: 400,
                  color: "inherit",
                },
              }}
            />
          </Box>
        </ListItemButton>
      </ListItem>
    </List>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            top: "64px",
            height: "calc(100vh - 64px)",
            backgroundColor: "#fff",
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", lg: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            top: "64px",
            height: "calc(100vh - 64px)",
            backgroundColor: "#fff",
            borderRight: "1px solid rgba(0, 0, 0, 0.12)",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
