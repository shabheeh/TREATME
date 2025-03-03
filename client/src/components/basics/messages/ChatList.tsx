import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Badge,
  InputBase,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,

} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { IChat } from "../../../types/chat/chat.types";
import DoctorSearchModal from "./DoctorModal";

interface ChatListProps {
  chats: IChat[];
  activeChat: IChat | null;
  onChatSelect: (chat: IChat) => void;
  startNewChat: (userId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChat,
  onChatSelect,
  startNewChat,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDoctorModalOpen, setDoctorModalOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Open menu at clicked position
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close menu
  };


  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
        border: 1,
        borderColor: "teal",
        mr: 0.5,
      }}
    >
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "teal" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Messages
          </Typography>
          <IconButton
            color="inherit"
            size="small"
            onClick={handleMenuClick}
            aria-label="more options"
            aria-controls={open ? "chat-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="chat-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={() => setDoctorModalOpen(true)}>
              New Chat
            </MenuItem>
            {/* <MenuItem onClick={() => handleMenuItemClick("Leave Chat")}>
              Leave Chat
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("Settings")}>
              Settings
            </MenuItem> */}
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Search */}
      <Box sx={{ p: 1, bgcolor: "#fff" }}>
        <Box
          sx={{
            position: "relative",
            borderRadius: 20,
            bgcolor: "#f0f2f5",
            "&:hover": {
              bgcolor: "#e6e6e6",
            },
            mr: 0,
            ml: 0,
            width: "100%",
            [theme.breakpoints.up("sm")]: {
              width: "100%",
            },
          }}
        >
          <Box
            sx={{
              p: "0 16px", // theme.spacing(0, 2)
              height: "100%",
              position: "absolute",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#54656f",
            }}
          >
            <SearchIcon />
          </Box>
          <InputBase
            placeholder="Search or start new chat"
            inputProps={{ "aria-label": "search" }}
            sx={{
              color: "inherit",
              width: "100%",
              "& .MuiInputBase-input": {
                p: "8px 8px 8px 0", // theme.spacing(1, 1, 1, 0)
                pl: "calc(1em + 32px)", // calc(1em + theme.spacing(4))
                transition: theme.transitions.create("width"),
                width: "100%",
              },
            }}
          />
        </Box>
      </Box>

      {/* Chat List */}
      <List
        sx={{
          flexGrow: 1,
          overflow: "auto",
          p: 0,
          "& .MuiListItem-root": {
            borderBottom: "1px solid #f0f2f5",
          },
        }}
      >
        {chats.map((chat) => (
          <ListItem
            key={chat._id}
            alignItems="flex-start"
            onClick={() => onChatSelect(chat)}
            sx={{
              cursor: "pointer",
              bgcolor: activeChat?._id === chat._id ? "#E0F7F7" : "transparent",
              "&:hover": {
                bgcolor: "#f5f5f5",
              },
              py: 1,
            }}
          >
            <ListItemAvatar>
              <Avatar
                alt={chat.participants[1].fistName}
                src={chat.participants[1].profilePicture}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    component="span"
                    noWrap
                    sx={{ maxWidth: { xs: "120px", sm: "150px", md: "180px" } }}
                  >
                    {chat.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {chat.createdAt.toString()}
                  </Typography>
                </Box>
              }
              secondary={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      display: "inline",
                      maxWidth: { xs: "120px", sm: "150px", md: "180px" },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {chat.lastMessage?.content}
                  </Typography>
                  {chat.participants.length > 0 && (
                    <Badge
                      badgeContent={3}
                      sx={{
                        "& .MuiBadge-badge": {
                          bgcolor: "#00a884",
                          color: "#fff",
                          fontSize: 10,
                          minWidth: 18,
                          height: 18,
                          p: "0 4px",
                        },
                      }}
                    />
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
      {isDoctorModalOpen && (
        <DoctorSearchModal
          isOpen={isDoctorModalOpen}
          onClose={() => setDoctorModalOpen(false)}
          onSelectDoctor={startNewChat}
        />
      )}
    </Box>
  );
};

export default ChatList;
