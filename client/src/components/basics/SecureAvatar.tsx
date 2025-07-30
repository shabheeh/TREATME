import React, { useState, useEffect } from "react";
import { getMedia } from "../../services/media/mediaService";
import { Avatar, Box, CircularProgress } from "@mui/material";

interface SecureAvatarProps {
  publicId?: string;
  alt?: string;
  className?: string;
  onError?: () => void;
  fallback?: React.ReactNode;
  sx?: object;
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  size?: number | string;
  children?: React.ReactNode;
}

const SecureAvatar: React.FC<SecureAvatarProps> = ({
  publicId,
  alt = "",
  className = "",
  onError,
  fallback,
  sx = {},
  imgProps = {},
  size = 40,
  children,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let revokeUrl: string | null = null;

    const fetchImage = async () => {
      if (!publicId) return;

      try {
        const response = await getMedia("image", publicId);

        if (response.status !== 200) {
          throw new Error("Failed to fetch image");
        }

        const url = URL.createObjectURL(response.data);
        setImageUrl(url);
        revokeUrl = url;
      } catch (err) {
        console.error("Error fetching secure avatar:", err);
        setError(true);
        if (onError) onError();
      }
    };

    fetchImage();

    return () => {
      if (revokeUrl) {
        URL.revokeObjectURL(revokeUrl);
      }
    };
  }, [publicId]);

  if (!imageUrl && publicId && !error) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: size,
          height: size,
          borderRadius: "50%",
          bgcolor: "grey.300",
          ...sx,
        }}
        className={className}
      >
        <CircularProgress size={24} color="inherit" />
      </Box>
    );
  }

  return (
    <Avatar
      src={!error && imageUrl ? imageUrl : undefined}
      alt={alt}
      className={className}
      sx={{
        width: size,
        height: size,
        ...sx,
      }}
      imgProps={{
        ...imgProps,
        crossOrigin: "anonymous",
        referrerPolicy: "no-referrer",
        onError: () => {
          setError(true);
          if (onError) onError();
        },
      }}
    >
      {fallback ?? children ?? alt?.[0]?.toUpperCase()}
    </Avatar>
  );
};

export default SecureAvatar;
