// controllers/mediaController.ts
import { Request, Response } from "express";
import { getSecureImage } from "../../utils/cloudinary";
import axios from "axios";

export async function getImageProxy(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { resourceType } = req.params;
    const publicId = req.query.publicId as string;

    if (!publicId || !resourceType) {
      res.status(400).json({ error: "Missing parameters" });
      return;
    }

    if (!["image", "video", "raw"].includes(resourceType)) {
      res.status(400).json({ error: "Invalid resource type" });
      return;
    }

    const { url } = await getSecureImage(
      publicId,
      resourceType as "image" | "video" | "raw"
    );

    const response = await axios.get(url, {
      responseType: "stream",
      headers: {
        Accept: "image/*",
      },
    });

    res.setHeader("Content-Type", response.headers["content-type"]);
    res.setHeader("Cache-Control", "private, max-age=3600");

    response.data.pipe(res);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to retrieve image" });
  }
}
