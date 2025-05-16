import React, { useState, useRef, useEffect, ChangeEvent } from "react";
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
  Chip,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  ArrowBack as ArrowBackIcon,
  Message as MessageIcon,
  Close as CloseIcon,
  Done as DoneIcon,
  DoneAll as DoneAllIcon,
} from "@mui/icons-material";
import {
  IMessage,
  SendMessageType,
  IChat,
} from "../../../types/chat/chat.types";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import { useSocket } from "../../../hooks/useSocket";
import chatService from "../../../services/chat/ChatService";
import Loading from "../ui/Loading";
import { formatTime } from "../../../utils/dateUtils";
import { toast } from "sonner";

interface MessageScreenProps {
  isMessagesLoading: boolean;
  messages: IMessage[];
  onBackClick?: () => void;
  activeChat: IChat | null;
  isMobile?: boolean;
  showBackButton?: boolean;
}

const MessageScreen: React.FC<MessageScreenProps> = ({
  isMessagesLoading,
  messages,
  onBackClick,
  activeChat,
  showBackButton = false,
}) => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSenderTyping, setSenderTyping] = useState<boolean>(false);
  const [isUserOnline, setUserOnline] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const doctor = useSelector((state: RootState) => state.user.admin);
  const admin = useSelector((state: RootState) => state.user.doctor);
  const patient = useSelector((state: RootState) => state.user.patient);

  const currentUser = patient || admin || doctor;

  const sender = activeChat?.participants.find(
    (participant) => participant.user._id !== currentUser?._id
  );

  const { socket } = useSocket();

  const unreadMessages = messages.filter((message) => message.isRead === false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAttachmentButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setAttachments((prevAttachments) => [...prevAttachments, ...newFiles]);
      event.target.value = "";
    }
  };

  const removeAttachment = (indexToRemove: number) => {
    setAttachments((prevAttachments) =>
      prevAttachments.filter((_, index) => index !== indexToRemove)
    );
  };

  // Handle typing indicator
  useEffect(() => {
    if (socket && sender?.user._id) {
      socket.emit("typing", {
        chatId: activeChat?._id,
        isTyping,
      });

      const timeout = setTimeout(() => setIsTyping(false), 2000); // Stop typing after 2 seconds
      return () => clearTimeout(timeout);
    }
  }, [isTyping, sender?.user._id, currentUser?._id, socket, activeChat?._id]);

  useEffect(() => {
    if (socket && sender?.user._id) {
      socket.on("typing", ({ chatId, userId, isTyping }) => {
        // update if event from other user
        if (chatId === activeChat?._id && userId !== currentUser?._id) {
          setSenderTyping(isTyping);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("typing");
      }
    };
  }, [socket, activeChat?._id, currentUser?._id, sender?.user._id]);

  useEffect(() => {
    if (!socket || !sender?.user._id) return;

    socket.on("user-online", (data) => {
      if (data.userId === sender.user._id) {
        setUserOnline(true);
      }
    });

    socket.on("user-offline", ({ userId }) => {
      if (userId === sender.user._id) {
        setUserOnline(false);
      }
    });

    return () => {
      if (socket) {
        socket.off("user-online");
        socket.off("user-offline");
      }
    };
  }, [socket, sender?.user]);

  // Handle message sending
  const handleSend = async () => {
    if (!activeChat) return;
    if (!newMessage.trim() && attachments.length === 0) return;

    try {
      if (attachments.length > 0) {
        const formData = new FormData();
        attachments.forEach((file) => formData.append("attachments", file));
        formData.append("chat", activeChat._id);
        formData.append("content", newMessage.trim());

        const message = await chatService.sendMessage(formData);
        if (socket && message) {
          socket.emit("message-sent", {
            chat: activeChat._id,
            messageId: message._id,
          });
        }
      } else {
        const messageData: Partial<SendMessageType> = {
          chat: activeChat._id,
          content: newMessage.trim(),
          attachments: [],
        };
        if (socket) {
          socket.emit("send-message", messageData);
        }
      }

      // Clear input and attachments
      setNewMessage("");
      setAttachments([]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  // Handle key press for Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeChat) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f0f2f5",
          flexDirection: "column",
          border: 1,
          borderColor: "teal",
        }}
      >
        <Box sx={{ color: "teal", mb: 2 }}>
          <MessageIcon sx={{ fontSize: 64 }} />
        </Box>
        <Typography
          variant="h5"
          sx={{ mb: 1, color: "#41525d", textAlign: "center", px: 2 }}
        >
          Welcome to Messages
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: "center", px: 3 }}
        >
          Select a conversation to start chatting
        </Typography>
      </Box>
    );
  }

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
            src={sender?.user.profilePicture}
            alt={sender?.user.firstName}
            sx={{ mr: 2, width: 40, height: 40 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" noWrap>
              {sender?.user.firstName} {sender?.user.lastName}
            </Typography>
            <Typography variant="caption" color="white">
              {isSenderTyping
                ? "Typing..."
                : isUserOnline
                  ? "Online"
                  : "Offline"}
            </Typography>
          </Box>
          <IconButton color="inherit" size="small">
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Messages */}
      {isMessagesLoading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            p: { xs: 1, sm: 2 },
            backgroundRepeat: "repeat",
            backgroundSize: "contain",
          }}
        >
          {messages.map((message, index) => {
            const isUnread = unreadMessages.some(
              (unreadMessage) =>
                unreadMessage._id === message._id &&
                unreadMessage.sender._id !== currentUser?._id
            );
            const showDivider =
              isUnread &&
              (index === 0 ||
                !unreadMessages.some(
                  (unreadMessage) =>
                    unreadMessage._id === messages[index - 1]._id
                ));

            return (
              <React.Fragment key={message._id}>
                {showDivider && (
                  <Divider sx={{ my: 2, borderColor: "teal" }}>
                    <Typography variant="caption" color="teal">
                      Unread Messages
                    </Typography>
                  </Divider>
                )}
                <Box
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
                      p: { xs: 0.5, sm: 0.5 },
                      borderRadius: 2,
                      borderTopRightRadius:
                        message.sender._id === currentUser?._id ? 0 : 2,
                      borderTopLeftRadius:
                        message.sender._id === currentUser?._id ? 2 : 0,
                      bgcolor:
                        message.sender._id === currentUser?._id
                          ? "teal"
                          : "#E0F7F7",
                      color:
                        message.sender._id === currentUser?._id
                          ? "white"
                          : "#003D3D",
                      boxShadow: "none",
                      display: "flex",
                      flexDirection: "row",
                      gap: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      {message.attachments?.map((attachment, index) => (
                        <Box key={index} sx={{ mt: 1 }}>
                          {attachment.resourceType === "image" ? (
                            <Box sx={{ position: "relative" }}>
                              <a
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Box
                                  component="img"
                                  src={attachment.url}
                                  alt="attachment"
                                  sx={{
                                    width: { xs: "100%", sm: "200px" },
                                    maxWidth: "200px",
                                    aspectRatio: "1 / 1",
                                    height: "auto",
                                    borderRadius: "8px",
                                    objectFit: "cover",
                                  }}
                                />
                              </a>
                              {message.content && (
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="flex-end"
                                  sx={{ mt: 1 }}
                                >
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      wordBreak: "break-word",
                                      flexGrow: 1,
                                    }}
                                  >
                                    {message.content}
                                  </Typography>
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    sx={{ ml: 1 }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "0.7rem",
                                        color: "#8696a0",
                                        textAlign: "right",
                                      }}
                                    >
                                      {formatTime(message.createdAt)}
                                    </Typography>
                                    {message.sender._id ===
                                      currentUser?._id && (
                                      <>
                                        {message.isRead ? (
                                          <DoneAllIcon
                                            sx={{
                                              width: 15,
                                              marginLeft: 0.5,
                                            }}
                                          />
                                        ) : (
                                          <DoneIcon
                                            sx={{
                                              width: 15,
                                              marginLeft: 0.5,
                                            }}
                                          />
                                        )}
                                      </>
                                    )}
                                  </Box>
                                </Box>
                              )}
                              {!message.content && (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      padding: "2px 4px",
                                      fontSize: "0.75rem",
                                      color: "rgba(255, 255, 255, 0.8)",
                                      textShadow:
                                        "1px 1px 2px rgba(0, 0, 0, 0.5)",
                                    }}
                                  >
                                    {formatTime(message.createdAt)}
                                  </Typography>
                                  {message.sender._id === currentUser?._id && (
                                    <>
                                      {message.isRead ? (
                                        <DoneAllIcon
                                          sx={{
                                            width: 15,
                                            marginLeft: 0.5,
                                          }}
                                        />
                                      ) : (
                                        <DoneIcon
                                          sx={{
                                            width: 15,
                                            marginLeft: 0.5,
                                          }}
                                        />
                                      )}
                                    </>
                                  )}
                                </Box>
                              )}
                            </Box>
                          ) : (
                            <Tooltip title={attachment.resourceType}>
                              <Chip
                                icon={<AttachFileIcon />}
                                label={attachment.resourceType}
                                sx={{
                                  maxWidth: "200px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      ))}
                      {!message.attachments?.length && (
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="flex-end"
                          sx={{ mt: 1 }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ wordBreak: "break-word", flexGrow: 1 }}
                          >
                            {message.content}
                          </Typography>
                          <Box
                            display="flex"
                            alignItems="center"
                            sx={{ ml: 1 }}
                          >
                            <Typography
                              sx={{
                                fontSize: "0.7rem",
                                color: "#8696a0",
                                textAlign: "right",
                              }}
                            >
                              {formatTime(message.createdAt)}
                            </Typography>
                            {message.sender._id === currentUser?._id && (
                              <>
                                {message.isRead ? (
                                  <DoneAllIcon
                                    sx={{
                                      width: 15,
                                      marginLeft: 0.5,
                                    }}
                                  />
                                ) : (
                                  <DoneIcon
                                    sx={{
                                      width: 15,
                                      marginLeft: 0.5,
                                    }}
                                  />
                                )}
                              </>
                            )}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </Box>
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>
      )}

      {/* preview attchmnts */}
      {attachments.length > 0 && (
        <Box
          sx={{
            p: 2,
            bgcolor: "#f0f2f5",
            borderBottom: "1px solid #ddd",
            maxHeight: "200px",
            overflowY: "auto",
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {attachments.map((file, index) => {
            const fileUrl = URL.createObjectURL(file);
            return (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  width: "100px",
                  height: "100px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid #ddd",
                  cursor: "pointer",
                }}
              >
                {file.type.startsWith("image/") ? (
                  <Box
                    component="img"
                    src={fileUrl}
                    alt="preview"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#e0e0e0",
                    }}
                  >
                    <AttachFileIcon sx={{ fontSize: "3rem", color: "#aaa" }} />
                  </Box>
                )}
                <IconButton
                  onClick={() => removeAttachment(index)}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    color: "#fff",
                    "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Input */}
      <Box sx={{ p: { xs: 1, sm: 2 }, bgcolor: "#f0f2f5" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <>
            <IconButton
              color="default"
              sx={{ color: "#54656f" }}
              onClick={handleAttachmentButtonClick}
            >
              <AttachFileIcon />
              <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </IconButton>
          </>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              setIsTyping(!!e.target.value.trim());
            }}
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
                  <IconButton
                    edge="end"
                    onClick={handleSend}
                    sx={{ color: "#00a884" }}
                  >
                    <SendIcon />
                  </IconButton>
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
