import React from "react";
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
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  unread: number;
}

interface ChatListProps {
  chats: ChatItem[];
  activeChat: string | null;
  onChatSelect: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChat,
  onChatSelect,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
          <IconButton color="inherit" size="small">
            <MoreVertIcon />
          </IconButton>
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
            key={chat.id}
            alignItems="flex-start"
            onClick={() => onChatSelect(chat.id)}
            sx={{
              cursor: "pointer",
              bgcolor: activeChat === chat.id ? "#E0F7F7" : "transparent",
              "&:hover": {
                bgcolor: "#f5f5f5",
              },
              py: 1,
            }}
          >
            <ListItemAvatar>
              <Avatar alt={chat.name} src={chat.avatar} />
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
                    {chat.time}
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
                    {chat.lastMessage}
                  </Typography>
                  {chat.unread > 0 && (
                    <Badge
                      badgeContent={chat.unread}
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
    </Box>
  );
};

export default ChatList;