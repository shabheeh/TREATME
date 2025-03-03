import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Paper,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Send as SendIcon,
  Mic as MicIcon,
  AttachFile as AttachFileIcon,
  ArrowBack as ArrowBackIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import { IMessage, ISender } from "../../../types/chat/chat.types";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";

interface MessageScreenProps {
  sender: ISender | null;
  messages: IMessage[];
  // onSendMessage: (text: string) => void;
  onBackClick?: () => void;
  isMobile?: boolean;
  showBackButton?: boolean;
}

const MessageScreen: React.FC<MessageScreenProps> = ({
  sender,
  messages,
  // onSendMessage,
  onBackClick,
  isMobile = false,
  showBackButton = false,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const doctor = useSelector((state: RootState) => state.user.admin);
  const admin = useSelector((state: RootState) => state.user.doctor);
  const patient = useSelector((state: RootState) => state.user.patient);

  const currentUser = patient || admin || doctor;

  const handleSend = () => {
    if (newMessage.trim()) {
      // onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // if (!contact) {
  //   return (
  //     <Box
  //       sx={{
  //         height: "100%",
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         bgcolor: "#f0f2f5",
  //         flexDirection: "column",
  //         border: 1,
  //         borderColor: "teal",
  //       }}
  //     >
  //       <Box sx={{ color: "teal", mb: 2 }}>
  //         <MessageIcon sx={{ fontSize: 64 }} />
  //       </Box>
  //       <Typography
  //         variant="h5"
  //         sx={{ mb: 1, color: "#41525d", textAlign: "center", px: 2 }}
  //       >
  //         Welcome to Messages
  //       </Typography>
  //       <Typography
  //         variant="body1"
  //         color="text.secondary"
  //         sx={{ textAlign: "center", px: 3 }}
  //       >
  //         Select a conversation to start chatting
  //       </Typography>
  //     </Box>
  //   );
  // }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
        border: 1,
        borderColor: "teal",
      }}
    >
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "teal" }}>
        <Toolbar>
          {showBackButton && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={onBackClick}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Avatar
            src={sender?.profilePicture}
            alt={sender?.fistName}
            sx={{ mr: 2, width: 40, height: 40 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" noWrap>
              {sender?.fistName}
            </Typography>
            <Typography variant="caption" color="white">
              Online
            </Typography>
          </Box>
          <IconButton color="inherit" size="small">
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Messages */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          p: { xs: 1, sm: 2 },
          backgroundRepeat: "repeat",
          backgroundSize: "contain",
        }}
      >
        {messages.map((message) => (
          <Box
            key={message._id}
            sx={{
              display: "flex",
              justifyContent:
                message.sender._id === currentUser?._id
                  ? "flex-end"
                  : "flex-start",
              mb: 1,
            }}
          >
            <Paper
              sx={{
                maxWidth: { xs: "85%", sm: "70%" },
                p: { xs: 1, sm: 1.5 },
                borderRadius: 2,
                borderTopRightRadius:
                  message.sender._id === currentUser?._id ? 0 : 2,
                borderTopLeftRadius:
                  message.sender._id === currentUser?._id ? 2 : 0,
                bgcolor:
                  message.sender._id === currentUser?._id ? "teal" : "#E0F7F7 ",
                color:
                  message.sender._id === currentUser?._id
                    ? "white"
                    : "#003D3D ",
                boxShadow: "none",
              }}
            >
              <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                {message.content}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  color: "#8696a0",
                  mt: 0.5,
                  textAlign: "right",
                }}
              >
                {message.createdAt.toString()}
              </Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ p: { xs: 1, sm: 2 }, bgcolor: "#f0f2f5" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {!isSmallScreen && (
            <IconButton color="default" sx={{ color: "#54656f" }}>
              <AttachFileIcon />
            </IconButton>
          )}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            size="small"
            sx={{
              mx: { xs: 0.5, sm: 1 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 28,
                bgcolor: "#fff",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {newMessage.trim() ? (
                    <IconButton
                      edge="end"
                      onClick={handleSend}
                      sx={{ color: "#00a884" }}
                    >
                      <SendIcon />
                    </IconButton>
                  ) : (
                    <IconButton edge="end" sx={{ color: "#54656f" }}>
                      <MicIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MessageScreen;
