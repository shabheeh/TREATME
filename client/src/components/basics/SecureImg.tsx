import React, { useState, useEffect } from "react";
import { getMedia } from "../../services/media/mediaService";
import { Box, CircularProgress, Typography } from "@mui/material";

interface SecureImageProps {
  publicId: string;
  resourceType?: "image" | "video" | "raw";
  alt?: string;
  className?: string;
  onError?: () => void;
  fallback?: React.ReactNode;
  sx?: object;
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}

const SecureImage: React.FC<SecureImageProps> = ({
  publicId,
  resourceType = "image",
  alt = "",
  className = "",
  onError,
  fallback,
  sx = {},
  imgProps = {},
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await getMedia("image", publicId);

        if (response.status !== 200) {
          throw new Error("Failed to fetch image");
        }

        const url = URL.createObjectURL(response.data);
        setImageUrl(url);
      } catch (err) {
        console.error("Error fetching secure image:", err);
        setError(true);
        if (onError) onError();
      }
    };

    fetchImage();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [publicId, resourceType]);

  if (error) {
    return (
      fallback || (
        <Box
          className={className}
          sx={{
            bgcolor: "grey.200",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...sx,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Image not available
          </Typography>
        </Box>
      )
    );
  }

  if (!imageUrl) {
    return (
      <Box
        className={className}
        sx={{
          bgcolor: "grey.200",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...sx,
        }}
      >
        <CircularProgress size={24} color="inherit" />
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={imageUrl}
      alt={alt}
      className={className}
      onError={() => {
        setError(true);
        if (onError) onError();
      }}
      sx={{
        display: "block",
        maxWidth: "100%",
        height: "auto",
        ...sx,
      }}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      {...imgProps}
    />
  );
};

export default SecureImage;
