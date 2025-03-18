import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  InputBase,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  useTheme,
  Menu,
  MenuItem,
  Skeleton,
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { IChat } from "../../../types/chat/chat.types";
import DoctorSearchModal from "./DoctorModal";
import { formatMessageTime } from "../../../utils/dateUtils";
import useCurrentUser from "../../../hooks/useCurrentUser";

interface ChatListProps {
  isChatsLoading: boolean;
  chats: IChat[];
  activeChat: IChat | null;
  onChatSelect: (chat: IChat) => void;
  startNewChat: (userId: string, userType2: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  isChatsLoading,
  chats,
  activeChat,
  onChatSelect,
  startNewChat,
}) => {
  const [isDoctorModalOpen, setDoctorModalOpen] = useState(false);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [filteredChats, setFilteredChats] = useState<IChat[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const currentUser = useCurrentUser();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const filterChats = chats.filter((chat) =>
      chat.participants.some(
        (user) =>
          user.user.firstName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          user.user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredChats(filterChats);
  }, [searchQuery, chats]);

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
              p: "0 16px",
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
            placeholder="Search chats"
            inputProps={{ "aria-label": "search" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              color: "inherit",
              width: "100%",
              "& .MuiInputBase-input": {
                p: "8px 8px 8px 0",
                pl: "calc(1em + 32px)",
                transition: theme.transitions.create("width"),
                width: "100%",
              },
            }}
          />
        </Box>
      </Box>

      {isChatsLoading ? (
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
          {Array.from({ length: 4 }).map((_, index) => (
            <ListItem
              key={index}
              alignItems="flex-start"
              sx={{
                cursor: "pointer",
                py: 1,
              }}
            >
              {/* Avatar */}
              <ListItemAvatar>
                <Avatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </Avatar>
              </ListItemAvatar>

              {/* Text Content */}
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* Name */}
                    <Skeleton
                      variant="text"
                      sx={{
                        width: { xs: "70px", sm: "90px", md: "100px" },
                      }}
                    />

                    {/* Timestamp */}
                    <Skeleton variant="text" width={60} />
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
                    {/* Last Message */}
                    <Skeleton
                      variant="text"
                      sx={{
                        width: { xs: "100px", sm: "130px", md: "150px" },
                      }}
                    />

                    {/* Unread Count */}
                    {/* <Badge
                      badgeContent={
                        <Skeleton variant="circular" width={18} height={18} />
                      }
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: 10,
                          minWidth: 18,
                          height: 18,
                          p: "0 4px",
                        },
                      }}
                    /> */}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
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
          {filteredChats.map((chat) => (
            <ListItem
              key={chat._id}
              alignItems="flex-start"
              onClick={() => onChatSelect(chat)}
              sx={{
                cursor: "pointer",
                bgcolor:
                  activeChat?._id === chat._id ? "#E0F7F7" : "transparent",
                "&:hover": {
                  bgcolor: "#f5f5f5",
                },
                py: 1,
              }}
            >
              <ListItemAvatar>
                <Avatar
                  alt={chat.participants[1].user.firstName}
                  src={chat.participants[1].user.profilePicture}
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
                      sx={{
                        maxWidth: { xs: "120px", sm: "150px", md: "180px" },
                      }}
                    >
                      {chat.participants[1].user.firstName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {chat.lastMessage &&
                        formatMessageTime(chat.lastMessage?.createdAt)}
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
                      {chat.lastMessage?.sender._id === currentUser?._id &&
                        "You:"}{" "}
                      {chat.lastMessage?.content}
                    </Typography>
                    {/* {chat.participants.length > 0 && (
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
                    )} */}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      )}

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
