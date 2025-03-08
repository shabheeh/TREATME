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
import ChatScreen from "./ChatScreen";
import { Menu as MenuIcon } from "@mui/icons-material";
import { IChat, IMessage } from "../../../types/chat/chat.types";
import chatService from "../../../services/chat/ChatService";
import { toast } from "sonner";
import { useSocket } from "../../../hooks/useSocket";
import { useToastManager } from "../../../hooks/useToastMangager";
import {
  useNotification,
  useToast,
  useToaster,
} from "../../../contexts/ToastContext";
import { NotificationType } from "../../../types/notification/notification.types";

interface ChatPageProps {
  // Optional props for layout integration
  navbarHeight?: number | string;
  sidebarWidth?: number | string;
}

const Messages: React.FC<ChatPageProps> = ({
  navbarHeight = "64px",
  sidebarWidth = "0px",
}) => {
  const [activeChat, setActiveChat] = useState<IChat | null>(null);
  const [chats, setChats] = useState<IChat[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isChatsLoading, setChatsLoading] = useState<boolean>(false);
  const [isMessagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [chatListOpen, setChatListOpen] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { socket } = useSocket();
  const { addNotification } = useToaster();

  useEffect(() => {
    fetchChats();
    // showNotifications();
  }, []);

  useEffect(() => {
    if (!activeChat) return;
    fetchMessages(activeChat._id);
  }, [activeChat]);


  useEffect(() => {
    if (isMobile && activeChat) {
      setChatListOpen(false);
    }
  }, [activeChat, isMobile]);

  const fetchChats = async () => {
    try {
      setChatsLoading(true);
      const chats = await chatService.getChats();
      setChats(chats);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch chats"
      );
    } finally {
      setChatsLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      setMessagesLoading(true);
      const messages = await chatService.getMessages(chatId);
      setMessages(messages);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch Messages"
      );
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleChatSelect = (chat: IChat) => {
    setActiveChat(chat);
    if (isMobile) {
      toggleChatList();
    }
  };

  const showNotifications = () => {
    addNotification({
      title: "System Update",
      message: "The system will undergo maintenance in 30 minutes",
      type: "message",
      actions: [
        {
          label: "Learn More",
          onClick: () => console.log("Opening more info"),
        },
      ],
    });
  };

  useEffect(() => {
    if (!socket) return;

    // new message
    const handleNewMessage = (message: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("new-message", handleNewMessage);

    socket.on("join-chat", (userId: string) => {
      setOnlineUsers((prev) =>
        [...prev, userId].filter((id, idx, self) => self.indexOf(id) === idx)
      );
    });

    // user left chat
    socket.on("leave-chat", (userId: string) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    // Handle connection or server errors
    socket.on("error", (error: { message: string }) => {
      console.error("Socket error:", error.message);
      // Optionally display error to user or retry connection
    });

    // Cleanup: Remove all event listeners
    return () => {
      socket.off("online-users");
      socket.off("new-message", handleNewMessage);
      socket.off("typing");
      socket.off("stop-typing");
      socket.off("join-chat");
      socket.off("leave-chat");
      socket.off("chat-updated");
      socket.off("error");
    };
  }, [socket, setOnlineUsers, setMessages]);

  useEffect(() => {
    if (activeChat && socket) {
      socket.emit("join-chat", activeChat._id);
    }
  }, [activeChat, socket]);

  const startNewChat = async (userId2: string, userType2: string) => {
    try {
      const chat = await chatService.createOrAccessChat(userId2, userType2);

      // check if the chat already exists in the chats
      const isChatAlreadyPresent = chats.some(
        (existingChat) => existingChat._id === chat._id
      );

      if (!isChatAlreadyPresent) {
        setChats((prev) => [chat, ...prev]);
      }

      setActiveChat(chat);
    } catch (error) {
      console.error("Error starting new chat:", error);
    }
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
      {/* Chat List */}
      {isMobile ? (
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
            isChatsLoading={isChatsLoading}
            startNewChat={startNewChat}
            chats={chats}
            activeChat={activeChat}
            onChatSelect={handleChatSelect}
          />
        </Drawer>
      ) : (
        <Paper
          elevation={0}
          sx={{
            width: isMobile ? "280px" : "350px",
            height: "100%",
            display: chatListOpen ? "block" : "none",
            borderRight: 1,
            borderColor: "divider",
            borderRadius: 0,
          }}
        >
          <ChatList
            isChatsLoading={isChatsLoading}
            startNewChat={startNewChat}
            chats={chats}
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

        <ChatScreen
          isMessagesLoading={isMessagesLoading}
          messages={messages}
          // onSendMessage={handleSendMessage}
          activeChat={activeChat}
          onBackClick={isMobile ? toggleChatList : undefined}
          isMobile={isMobile}
          showBackButton={isMobile && activeChat !== null}
        />
      </Box>
    </Box>
  );
};

export default Messages;
