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
  const [chatsLoading, setChatsLoading] = useState<boolean>(false);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [chatListOpen, setChatListOpen] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isTyping, setTyping] = useState<boolean>(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const { socket } = useSocket();

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (!activeChat) return;
    fetchMessages(activeChat._id);
  }, [activeChat]);

  // Close chat list when selecting a chat on mobile
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
      console.log(chats, "chats");
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
  };

  useEffect(() => {
    if (!socket) return; // Ensure socket exists

    // Handle new message
    const handleNewMessage = (message: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    // Handle online users update
    // socket.on("online users", (users: string[]) => {
    //   setOnlineUsers(users);
    // });

    // Handle new message received
    socket.on("message received", handleNewMessage);

    // Handle typing indicator
    socket.on("typing", () => {
      setTyping(true);
    });

    // Handle stop typing indicator
    socket.on("stop-typing", () => {
      setTyping(false);
    });

    // Handle user joined chat
    socket.on("join-chat", (userId: string) => {
      // console.log(`${userId} joined chat ${chatId}`);
      // Optionally update chat participants or online users
      setOnlineUsers((prev) =>
        [...prev, userId].filter((id, idx, self) => self.indexOf(id) === idx)
      );
    });

    // Handle user left chat
    socket.on("leave-chat", (userId: string) => {
      // console.log(`${userId} left chat ${chatId}`);
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    // Handle chat updated (e.g., name change, new participants)
    // socket.on("chat updated", (updatedChat: IChatDTO) => {
    //   setChat(updatedChat);
    // });

    // Handle connection or server errors
    socket.on("error", (error: { message: string }) => {
      console.error("Socket error:", error.message);
      // Optionally display error to user or retry connection
    });

    // Cleanup: Remove all event listeners
    return () => {
      socket.off("online-users");
      socket.off("message received", handleNewMessage);
      socket.off("typing");
      socket.off("stop-typing");
      socket.off("join-chat");
      socket.off("leave-chat");
      socket.off("chat-updated");
      socket.off("error");
    };
  }, [socket, setOnlineUsers, setMessages, setTyping]);

  useEffect(() => {
    if (activeChat && socket) {
      socket.emit("join-chat", activeChat._id);
    }
  }, [activeChat, socket]);

  const startNewChat = async (userId2: string, userType2: string) => {
    const result = await chatService.createOrAccessChat(userId2, userType2);
    setChats((prev) => [result, ...prev]);
    setActiveChat(result);
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
            // user={activeChat && activeChat?.participants[1]}
            startNewChat={startNewChat}
            chats={chats}
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
          sender={activeChat && activeChat.participants[1]}
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
