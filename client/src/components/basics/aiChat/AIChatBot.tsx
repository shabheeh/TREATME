import React, { useEffect, useRef, useState } from "react";
import {
  Fab,
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Paper,
} from "@mui/material";
import {
  AutoAwesome as ChatBotIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import aiChatService from "../../../services/aiChat/AIChatService";
import { toast } from "sonner";

interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "ai";
}

const AIChatBot: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      text: "Hello! I'm your ai assistant. How can I help you today?",
      sender: "ai",
    },
  ]);
  const userRole = useSelector((state: RootState) => state.auth.role);
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (userRole !== "patient") {
    return null;
  }

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: userInput,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const aiResult = await aiChatService.askAI(userInput);

      const aiResponse: ChatMessage = {
        id: Date.now() + 1,
        text: aiResult,
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Fab
        size="medium"
        color="primary"
        aria-label="chat"
        onClick={handleToggleChat}
        sx={{
          position: "fixed",
          bottom: 100,
          right: 10,
          zIndex: 1000,
        }}
      >
        <ChatBotIcon />
      </Fab>
      <Drawer
        anchor="right"
        open={isChatOpen}
        onClose={handleToggleChat}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 450 },
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: "20px 0 0 20px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {/* Chat Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            bgcolor: "primary.main",
            color: "white",
            borderTopLeftRadius: "20px",
          }}
        >
          <Typography variant="h6">Treatme AI Assistant</Typography>
          <IconButton color="inherit" onClick={handleToggleChat}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 2,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#ccc",
              borderRadius: "4px",
            },
          }}
        >
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                mb: 1,
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 1.5,
                  maxWidth: "70%",
                  bgcolor: msg.sender === "user" ? "primary.light" : "grey.200",
                  color: msg.sender === "user" ? "white" : "black",
                  borderRadius: "16px",
                  borderBottomLeftRadius:
                    msg.sender === "user" ? "16px" : "0px",
                  borderBottomRightRadius:
                    msg.sender === "user" ? "0px" : "16px",
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    mt: 0.5,
                    textAlign: "right",
                    display: "block",
                  }}
                ></Typography>
              </Paper>
            </Box>
          ))}

          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "start", mb: 1 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 1.5,
                  maxWidth: "70%",
                  bgcolor: "grey.200",
                  color: "text.secondary",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* Waving Three Dots */}
                <Box
                  sx={{
                    display: "flex",
                    gap: "4px",
                  }}
                >
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "text.secondary",
                        animation: `wave ${0.8 + index * 0.2}s infinite ease-in-out`,
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Chat Input Area */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isLoading}
            size="small"
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!userInput.trim() || isLoading}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Drawer>
    </>
  );
};

export default AIChatBot;
