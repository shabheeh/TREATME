import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../../hooks/useSocket";
import {
  Box,
  IconButton,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  Fade,
  Tooltip,
} from "@mui/material";
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  CallEnd,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { IAppointmentPopulated } from "../../../types/appointment/appointment.types";
import FeedbackModal from "./FeedbackModal";
import reviewService from "../../../services/review/reviewService";
import { toast } from "sonner";
import appointmentService from "../../../services/appointment/appointmentService";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/app/store";
import dayjs from "dayjs";

const VideoCall = () => {
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);
  const pendingCandidates = useRef<RTCIceCandidate[]>([]);

  // track connection attempts
  const isConnecting = useRef<boolean>(false);

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  // const [unreadMessages, setUnreadMessages] = useState<number>(0);
  // const [showChat, setShowChat] = useState<boolean>(false);

  const [isReviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [appointment, setAppointment] = useState<IAppointmentPopulated | null>(
    null
  );

  const navigate = useNavigate();
  const { socket } = useSocket();

  const userRole = useSelector((state: RootState) => state.auth.role);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const roomId = urlParams.get("room");

  useEffect(() => {
    if (!roomId) return;
    const fetchAppointment = async () => {
      try {
        const appointment = await appointmentService.getAppointment(roomId);
        if (!appointment) return;
        setAppointment(appointment);
        const now = dayjs();
        const endTime = dayjs(appointment.date).add(
          appointment.duration,
          "minute"
        );
        const timePassed = now.diff(endTime, "minutes");

        if (timePassed > 10) {
          // endCall();
          // return;
          toast.error("The appointment has already completed");
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    };
    fetchAppointment();
  }, [roomId]);

  const toggleMute = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const closePeerConnection = () => {
    if (peerRef.current) {
      if (peerRef.current.signalingState !== "closed") {
        peerRef.current.close();
      }
      peerRef.current = null;
    }
  };

  const stopMediaStreams = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        track.stop();
      });
      localStream.current = null;
    }

    if (remoteStream.current) {
      remoteStream.current.getTracks().forEach((track) => {
        track.stop();
      });
      remoteStream.current = null;
    }

    if (localVideo.current) localVideo.current.srcObject = null;
    if (remoteVideo.current) remoteVideo.current.srcObject = null;
  };

  const endCall = async () => {
    if (!appointment) return;
    stopMediaStreams();
    closePeerConnection();

    if (socket && roomId) {
      socket.emit("leave-room", roomId);
    }

    setIsConnected(false);

    const now = dayjs();
    const endTime = dayjs(appointment.date).add(appointment.duration, "minute");
    const timePassed = endTime.diff(now, "minutes");

    if (timePassed < 15 && timePassed > -5) {
      await appointmentService.updateAppointmentStatus(appointment?._id);
    }

    if (appointment && userRole && userRole === "patient") {
      if (timePassed < 25 && timePassed > 0) {
        setReviewModalOpen(true);
      } else {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  // setup WebRTC
  const setupWebRTC = async () => {
    if (isConnecting.current) return;
    isConnecting.current = true;

    try {
      closePeerConnection();
      stopMediaStreams();

      pendingCandidates.current = [];
      setIsConnected(false);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1080 },
          height: { ideal: 720 },
          frameRate: { ideal: 30, max: 60 },
        },
        audio: true,
      });

      localStream.current = stream;
      if (localVideo.current) {
        localVideo.current.srcObject = stream;
      }

      const peer = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
        ],
        iceCandidatePoolSize: 10,
      });
      peerRef.current = peer;

      remoteStream.current = new MediaStream();
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = remoteStream.current;
      }

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          if (socket && roomId) {
            socket.emit("candidate", { roomId, candidate: event.candidate });
          }
        }
      };

      // peer.onsignalingstatechange = () => {
      //   console.log(`Signaling state changed: ${peer.signalingState}`);
      //   if (peer.signalingState === "stable") {
      //     console.log(
      //       "Signaling state is stable, proceeding with negotiation if needed"
      //     );
      //   }
      // };

      peer.oniceconnectionstatechange = () => {
        if (
          peer.iceConnectionState === "connected" ||
          peer.iceConnectionState === "completed"
        ) {
          setIsConnected(true);
        } else if (
          peer.iceConnectionState === "failed" ||
          peer.iceConnectionState === "disconnected"
        ) {
          console.warn("ICE connection issues detected");
          if (peer.signalingState !== "closed") {
            console.warn("Attempting to restart ICE...");
            peer.restartIce();
          }
        } else if (peer.iceConnectionState === "closed") {
          setIsConnected(false);
        }
      };

      peer.ontrack = (event) => {
        if (event.streams.length > 0) {
          event.streams[0].getTracks().forEach((track) => {
            remoteStream.current?.addTrack(track);
          });
          if (remoteVideo.current) {
            remoteVideo.current.srcObject = remoteStream.current;
          }
        } else {
          console.warn("No streams received in ontrack event!");
        }
        setIsConnected(true);
      };

      stream.getTracks().forEach((track) => {
        if (peer.signalingState !== "closed") {
          peer.addTrack(track, stream);
        } else {
          console.warn("Cannot add tracks: peer connection is closed");
          throw new Error(
            "Peer connection closed before tracks could be added"
          );
        }
      });

      let negotiationInProgress = false;
      peer.onnegotiationneeded = async () => {
        if (negotiationInProgress || peer.signalingState === "closed") {
          return;
        }

        try {
          negotiationInProgress = true;

          if (peer.signalingState !== "stable") {
            console.warn(`Cannot create offer in ${peer.signalingState} state`);
            negotiationInProgress = false;
            return;
          }

          const offer = await peer.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });

          if (peer.signalingState !== "closed") {
            await peer.setLocalDescription(offer);
            if (socket && roomId) {
              socket.emit("offer", { roomId, offer: peer.localDescription });
            }
          } else {
            console.warn("Peer closed before sending offer");
            throw new Error("Peer connection closed during negotiation");
          }
        } catch (error) {
          console.error("Error during negotiation:", error);
        } finally {
          negotiationInProgress = false;
        }
      };

      return peer;
    } catch (error) {
      console.error("Error setting up WebRTC:", error);
      closePeerConnection();
      stopMediaStreams();
      setIsConnected(false);
      throw error;
    } finally {
      isConnecting.current = false;
    }
  };

  const processPendingCandidates = async () => {
    const peer = peerRef.current;
    if (
      peer?.remoteDescription &&
      pendingCandidates.current.length > 0 &&
      peer.signalingState !== "closed"
    ) {
      for (const candidate of pendingCandidates.current) {
        try {
          await peer.addIceCandidate(candidate);
        } catch (error) {
          console.error("Error adding pending ICE candidate:", error);
        }
      }
      pendingCandidates.current = [];
    }
  };

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("join-room", roomId);

    const setupConnection = async () => {
      try {
        await setupWebRTC();

        socket.on("offer", async (data) => {
          const peer = peerRef.current;
          if (!peer || peer.signalingState === "closed") {
            console.warn("Cannot set remote offer: peer is closed or null");
            return;
          }
          try {
            await peer.setRemoteDescription(
              new RTCSessionDescription(data.offer)
            );
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            socket.emit("answer", { roomId, answer });
          } catch (error) {
            console.error("Error setting remote offer:", error);
          }
        });

        socket.on("answer", async (data) => {
          const peer = peerRef.current;
          if (!peer || peer.signalingState === "closed") {
            console.warn("Cannot set remote answer: peer is closed or null");
            return;
          }
          try {
            await peer.setRemoteDescription(
              new RTCSessionDescription(data.answer)
            );
            await processPendingCandidates();
          } catch (error) {
            console.error("Error setting remote answer:", error);
          }
        });

        socket.on("candidate", async (data) => {
          try {
            const candidate = new RTCIceCandidate(data.candidate);
            const peer = peerRef.current;
            if (!peer) {
              console.warn("Cannot add ICE candidate: peer is null");
              return;
            }
            if (peer.signalingState === "closed") {
              console.warn("Cannot add ICE candidate: peer is closed");
              return;
            }
            if (peer.remoteDescription) {
              await peer.addIceCandidate(candidate);
            } else {
              pendingCandidates.current.push(candidate);
            }
          } catch (error) {
            console.error("Error handling ICE candidate:", error);
          }
        });

        socket.on("user-disconnected", () => {
          setIsConnected(false);
        });
      } catch (error) {
        console.error("Failed to set up connection:", error);
      }
    };

    setupConnection();

    window.addEventListener("beforeunload", endCall);

    return () => {
      window.removeEventListener("beforeunload", endCall);
      if (socket) {
        socket.off("offer");
        socket.off("answer");
        socket.off("candidate");
        socket.off("user-disconnected");
      }
      stopMediaStreams();
      closePeerConnection();
    };
  }, [roomId, socket, navigate]);

  const handleReviewSubmit = async (
    reviewRating: number,
    reviewComment: string
  ) => {
    if (!appointment) return;
    try {
      await reviewService.addOrUpdateReview({
        doctor: appointment.doctor._id,
        patient: appointment.patient._id,
        rating: reviewRating,
        comment: reviewComment,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const handleModalClose = () => {
    setReviewModalOpen(false);
    navigate(-1);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        backgroundColor: "#000",
        overflow: "hidden",
      }}
      onMouseMove={() => setShowControls(true)}
    >
      <AppBar
        position="absolute"
        color="transparent"
        sx={{ background: "rgba(0,0,0,0.5)", boxShadow: "none", top: 0 }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">Telemedicine Appointment</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Paper
              sx={{
                px: 1,
                py: 0.5,
                mr: 2,
                borderRadius: "16px",
                backgroundColor: isConnected ? "success.main" : "warning.main",
              }}
            >
              <Typography variant="caption" sx={{ color: "white" }}>
                {isConnected ? "Connected" : "Connecting..."}
              </Typography>
            </Paper>
            <Typography variant="body2">
              {new Date().toLocaleTimeString()}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ width: "100%", height: "100%", backgroundColor: "#111" }}>
        <video
          ref={remoteVideo}
          autoPlay
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Overlay when not connected */}
        {!isConnected && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.7)",
              zIndex: 10,
            }}
          >
            <Typography variant="h5" color="white">
              Please wait...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Local video container */}
      <Paper
        elevation={6}
        sx={{
          position: "absolute",
          right: 16,
          bottom: showControls ? 100 : 16,
          width: { xs: "120px", sm: "160px", md: "200px" },
          height: { xs: "90px", sm: "120px", md: "150px" },
          overflow: "hidden",
          borderRadius: 2,
          transition: "all 0.3s ease",
        }}
      >
        <video
          ref={localVideo}
          autoPlay
          playsInline
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)",
          }}
        />
        {isVideoOff && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "#333",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="white">
              Camera Off
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Controls */}
      <Fade in={showControls}>
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 2,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: 6,
            padding: 1,
            zIndex: 20,
          }}
        >
          <Tooltip title={isMuted ? "Unmute" : "Mute"}>
            <IconButton
              onClick={toggleMute}
              sx={{
                backgroundColor: isMuted ? "error.main" : "grey.700",
                color: "white",
                "&:hover": {
                  backgroundColor: isMuted ? "error.dark" : "grey.800",
                },
              }}
            >
              {isMuted ? <MicOff /> : <Mic />}
            </IconButton>
          </Tooltip>

          <Tooltip title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}>
            <IconButton
              onClick={toggleVideo}
              sx={{
                backgroundColor: isVideoOff ? "error.main" : "grey.700",
                color: "white",
                "&:hover": {
                  backgroundColor: isVideoOff ? "error.dark" : "grey.800",
                },
              }}
            >
              {isVideoOff ? <VideocamOff /> : <Videocam />}
            </IconButton>
          </Tooltip>

          {/* <Tooltip title={showChat ? "Hide Chat" : "Show Chat"}>
            <IconButton
              onClick={() => {
                setShowChat(!showChat);
                setUnreadMessages(0);
              }}
              sx={{
                backgroundColor: "grey.700",
                color: "white",
                "&:hover": { backgroundColor: "grey.800" },
              }}
            >
              <Badge badgeContent={unreadMessages} color="error">
                {showChat ? <ChatIcon /> : <ChatBubble />}
              </Badge>
            </IconButton>
          </Tooltip> */}

          <Tooltip title="End Call">
            <IconButton
              onClick={endCall}
              sx={{
                backgroundColor: "error.main",
                color: "white",
                "&:hover": { backgroundColor: "error.dark" },
              }}
            >
              <CallEnd />
            </IconButton>
          </Tooltip>
        </Box>
      </Fade>

      {/* Chat panel (simplified)
      {showChat && (
        <Paper
          sx={{
            position: "absolute",
            right: 16,
            top: 80,
            bottom: 100,
            width: { xs: "280px", sm: "320px", md: "350px" },
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(255,255,255,0.9)",
            zIndex: 15,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 2, borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
            <Typography variant="h6">Chat</Typography>
          </Box>
          <Box sx={{ flexGrow: 1, p: 2, overflowY: "auto" }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Chat messages will appear here
            </Typography>
          </Box>
        </Paper>
      )} */}
      <FeedbackModal
        reviewModalOpen={isReviewModalOpen}
        onclose={handleModalClose}
        onSubmit={handleReviewSubmit}
      />
    </Box>
  );
};

export default VideoCall;
