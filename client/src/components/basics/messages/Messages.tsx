import React, { useState, useEffect } from "react";
import {
  Box,
  useMediaQuery,
  useTheme,
  Drawer,
  IconButton,
  Paper,
} from "@mui/material";
import ChatList from "./ChatList";
import MessageScreen from "./ChatScreen";
import { Menu as MenuIcon } from "@mui/icons-material";

// Sample data
const sampleChats = [
  {
    id: "1",
    name: "John Doe",
    lastMessage: "Hey, how are you doing?",
    time: "10:30 AM",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Sarah Smith",
    lastMessage: "The meeting is scheduled for tomorrow",
    time: "Yesterday",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    name: "Tech Group",
    lastMessage: "Alice: I found a solution to the bug",
    time: "Yesterday",
    avatar:
      "https://images.unsplash.com/photo-1603539947678-cd3954ed515d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    unread: 5,
    online: true,
  },
  {
    id: "4",
    name: "Mike Johnson",
    lastMessage: "Can you send me the files?",
    time: "Monday",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    unread: 0,
    online: false,
  },
  {
    id: "5",
    name: "Emma Wilson",
    lastMessage: "Thanks for your help!",
    time: "Monday",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    unread: 0,
    online: true,
  },
];

const sampleMessages = {
  "1": [
    {
      id: "1-1",
      text: "Hey there!",
      time: "10:00 AM",
      sender: "them" as const,
    },
    {
      id: "1-2",
      text: "How are you doing?",
      time: "10:05 AM",
      sender: "them" as const,
    },
    {
      id: "1-3",
      text: "I'm good, thanks! How about you?",
      time: "10:15 AM",
      sender: "me" as const,
    },
    {
      id: "1-4",
      text: "Pretty good. Working on that project we discussed.",
      time: "10:20 AM",
      sender: "them" as const,
    },
    {
      id: "1-5",
      text: "How's it coming along?",
      time: "10:30 AM",
      sender: "them" as const,
    },
  ],
  "2": [
    {
      id: "2-1",
      text: "Hi Sarah, about tomorrow's meeting",
      time: "3:00 PM",
      sender: "me" as const,
    },
    {
      id: "2-2",
      text: "Yes, it's scheduled for 10 AM",
      time: "3:05 PM",
      sender: "them" as const,
    },
    {
      id: "2-3",
      text: "Perfect, I'll be there",
      time: "3:10 PM",
      sender: "me" as const,
    },
    {
      id: "2-4",
      text: "Don't forget to bring the presentation",
      time: "Yesterday",
      sender: "them" as const,
    },
  ],
  "3": [
    {
      id: "3-1",
      text: "Has anyone looked at the bug in the login page?",
      time: "2:00 PM",
      sender: "them" as const,
    },
    {
      id: "3-2",
      text: "I'm checking it now",
      time: "2:15 PM",
      sender: "me" as const,
    },
    {
      id: "3-3",
      text: "It seems to be a problem with the authentication service",
      time: "2:30 PM",
      sender: "me" as const,
    },
    {
      id: "3-4",
      text: "I found a solution to the bug",
      time: "Yesterday",
      sender: "them" as const,
    },
  ],
};

interface ChatPageProps {
  // Optional props for layout integration
  navbarHeight?: number | string;
  sidebarWidth?: number | string;
}

const ChatPage: React.FC<ChatPageProps> = ({
  navbarHeight = "64px",
  sidebarWidth = "0px",
}) => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState(sampleMessages);
  const [chatListOpen, setChatListOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Close chat list when selecting a chat on mobile
  useEffect(() => {
    if (isMobile && activeChat) {
      setChatListOpen(false);
    }
  }, [activeChat, isMobile]);

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
  };

  const handleSendMessage = (text: string) => {
    if (!activeChat) return;

    const newMessage = {
      id: `${activeChat}-${Date.now()}`,
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "me" as const,
    };

    setMessages((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage],
    }));
  };

  const getActiveContact = () => {
    if (!activeChat) return null;
    const chat = sampleChats.find((c) => c.id === activeChat);
    if (!chat) return null;
    return {
      id: chat.id,
      name: chat.name,
      avatar: chat.avatar,
      online: chat.online,
    };
  };

  const toggleChatList = () => {
    setChatListOpen(!chatListOpen);
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        overflow: "hidden",
        marginLeft: { xs: 0, md: sidebarWidth },
        width: { xs: "100%", md: `calc(100% - ${sidebarWidth})` },
        position: "relative",
      }}
    >
      {/* Chat List - Responsive handling */}
      {isMobile ? (
        // Mobile: Drawer for chat list
        <Drawer
          anchor="left"
          open={chatListOpen}
          onClose={toggleChatList}
          sx={{
            width: "100%",
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: "100%",
              boxSizing: "border-box",
              height: `calc(100vh - ${navbarHeight})`,
              top: navbarHeight,
            },
          }}
          variant="temporary"
          ModalProps={{
            keepMounted: true,
          }}
        >
          <ChatList
            chats={sampleChats}
            activeChat={activeChat}
            onChatSelect={handleChatSelect}
          />
        </Drawer>
      ) : (
        // Desktop/Tablet: Side panel for chat list
        <Paper
          elevation={0}
          sx={{
            width: isTablet ? "280px" : "350px",
            height: "100%",
            display: chatListOpen ? "block" : "none",
            borderRight: 1,
            borderColor: "divider",
            borderRadius: 0,
          }}
        >
          <ChatList
            chats={sampleChats}
            activeChat={activeChat}
            onChatSelect={handleChatSelect}
          />
        </Paper>
      )}

      {/* Message Screen */}
      <Box
        sx={{
          flexGrow: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Toggle button for chat list on mobile */}
        {isMobile && !chatListOpen && (
          <IconButton
            color="primary"
            aria-label="open chat list"
            onClick={toggleChatList}
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              zIndex: 1100,
              bgcolor: "rgba(255, 255, 255, 0.8)",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.9)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <MessageScreen
          contact={getActiveContact()}
          messages={activeChat ? messages[activeChat] || [] : []}
          onSendMessage={handleSendMessage}
          onBackClick={isMobile ? toggleChatList : undefined}
          isMobile={isMobile}
          showBackButton={isMobile && activeChat !== null}
        />
      </Box>
    </Box>
  );
};

export default ChatPage;
