import { useEffect, useRef } from "react";
import { useSocket } from "../../../hooks/useSocket";

const VideoCall = () => {
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);

  const { socket } = useSocket();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const roomId = urlParams.get("room");

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("join-room", roomId);
    console.log(`Joined room: ${roomId}`);

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerRef.current = peer;

    // Get local media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log("🎥 Local stream obtained:", stream);
        localStream.current = stream; // Store the local stream
        if (localVideo.current) localVideo.current.srcObject = stream;
        stream.getTracks().forEach(
          (track) => peer.addTrack(track, stream) // Ensure tracks are added correctly
        );
      })
      .catch((error) => console.error("🚨 Error accessing media:", error));

    // Create an empty remote stream
    remoteStream.current = new MediaStream();
    if (remoteVideo.current)
      remoteVideo.current.srcObject = remoteStream.current;

    // 🔹 Handle Remote Tracks (Fixed duplicate issue)
    peer.ontrack = (event) => {
      console.log("🔹 Received remote track:", event.streams[0]);

      event.streams[0].getTracks().forEach((track) => {
        remoteStream.current?.addTrack(track);
      });

      if (remoteVideo.current) {
        remoteVideo.current.srcObject = remoteStream.current;
        remoteVideo.current.play();
      }
    };

    // 🔹 Handle ICE Candidate
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("📤 Sending ICE Candidate:", event.candidate);
        socket.emit("candidate", { roomId, candidate: event.candidate });
      }
    };

    // 🔹 Handle Connection State Changes
    peer.oniceconnectionstatechange = () => {
      console.log("🔄 ICE Connection State:", peer.iceConnectionState);
      if (
        peer.iceConnectionState === "failed" ||
        peer.iceConnectionState === "disconnected"
      ) {
        console.warn("🚨 ICE connection failed, restarting...");
        peer.restartIce();
      }
    };

    peer.onnegotiationneeded = async () => {
      console.log("⚡ Negotiation needed - creating offer");
      try {
        const offer = await peer.createOffer();
        console.log("📤 Sending offer:", offer);
        await peer.setLocalDescription(offer);
        socket.emit("offer", { roomId, offer });
      } catch (error) {
        console.error("🚨 Error creating offer:", error);
      }
    };

    // 🔹 Handle Offer
    socket.on("offer", async (data) => {
      console.log("📩 Received offer:", data.offer);
      try {
        if (peer.signalingState !== "stable") {
          console.warn(
            "🚨 Ignoring offer due to unstable signaling state:",
            peer.signalingState
          );
          return;
        }

        await peer.setRemoteDescription(new RTCSessionDescription(data.offer));
        console.log("✅ Remote description set!");

        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("answer", { roomId, answer });

        console.log("📤 Sent answer:", answer);
      } catch (error) {
        console.error("🚨 Error handling offer:", error);
      }
    });

    // 🔹 Handle Answer
    socket.on("answer", async (data) => {
      console.log("📩 Received answer:", data);
      console.log("Current signaling state:", peerRef.current?.signalingState);

      if (peerRef.current?.signalingState !== "have-local-offer") {
        console.warn(
          "⚠️ Skipping setRemoteDescription, wrong state:",
          peerRef.current?.signalingState
        );
        return;
      }

      try {
        await peerRef.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
        console.log("✅ Remote answer set!");
      } catch (error) {
        console.error("🚨 Error setting remote description:", error);
      }
    });

    // 🔹 Handle ICE Candidates
    socket.on("candidate", async (data) => {
      console.log("📩 Received ICE candidate:", data.candidate);
      try {
        if (peer.remoteDescription) {
          await peer.addIceCandidate(new RTCIceCandidate(data.candidate));
          console.log("✅ Successfully added ICE candidate!");
        } else {
          console.warn(
            "🚨 Skipping ICE candidate - no remote description yet!"
          );
        }
      } catch (error) {
        console.error("🚨 Error adding ICE candidate:", error);
      }
    });

    console.log("🔄 Signaling State:", peer.signalingState);

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("candidate");
      peer.close();
      peerRef.current = null;
    };
  }, [roomId]);

  return (
    <div>
      <h2>Video Call</h2>
      <div>
        <h3>Local Video</h3>
        <video ref={localVideo} autoPlay playsInline muted />
      </div>
      <div>
        <h3>Remote Video</h3>
        <video ref={remoteVideo} autoPlay playsInline />
      </div>
    </div>
  );
};

export default VideoCall;
