import cloudinary from "../configs/cloudinary";

export async function uploadToCloudinary(
  file: Express.Multer.File,
  folder: string
): Promise<{
  url: string;
  publicId: string;
  resourceType: "image" | "video" | "raw";
}> {
  try {
    const fileStr = file.buffer.toString("base64");
    const fileUri = `data:${file.mimetype};base64,${fileStr}`;
    const resourceType = getResourceType(file.mimetype);

    const uploadResponse = await cloudinary.uploader.upload(fileUri, {
      folder,
      resource_type: resourceType,
      type: "authenticated",
      invalidate: true,
      use_filename: true,
      unique_filename: false,
    });

    return {
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      resourceType,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image");
  }
}

export async function updateCloudinaryFile(
  oldPublicId: string,
  newImage: Express.Multer.File,
  folder: string
) {
  try {
    await cloudinary.uploader.destroy(oldPublicId, {
      resource_type: "image",
      type: "authenticated",
      invalidate: true,
    });

    const fileStr = newImage.buffer.toString("base64");
    const fileUri = `data:${newImage.mimetype};base64,${fileStr}`;
    const resourceType = getResourceType(newImage.mimetype);

    const uploadResponse = await cloudinary.uploader.upload(fileUri, {
      folder,
      resource_type: resourceType,
      type: "authenticated",
      invalidate: true,
    });

    return {
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      resourceType,
    };
  } catch (error) {
    console.error("Error updating Cloudinary image:", error);
    throw new Error("Failed to update image");
  }
}

export async function deleteCloudinaryFile(publicId: string) {
  try {
    const deleteResponse = await cloudinary.uploader.destroy(publicId);
    console.log("File deleted from Cloudinary:", deleteResponse);
    return deleteResponse;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new Error("Failed to delete file");
  }
}

const getResourceType = (mimeType: string): "image" | "video" | "raw" => {
  if (mimeType.startsWith("image/")) {
    return "image";
  } else if (mimeType.startsWith("video/")) {
    return "video";
  } else {
    return "raw";
  }
};

export async function getSecureImage(
  publicId: string,
  resourceType: "image" | "video" | "raw"
) {
  try {
    const resource = await cloudinary.api.resource(publicId, {
      resource_type: resourceType,
      type: "authenticated",
    });

    const signedUrl = cloudinary.url(publicId, {
      secure: true,
      sign_url: true,
      resource_type: resourceType,
      type: "authenticated",
      version: resource.version,
    });

    return {
      url: signedUrl,
      metadata: {
        format: resource.format,
        width: resource.width,
        height: resource.height,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Cloudinary API Error:", {
        publicId,
        error: error.message,
      });
    }

    throw new Error(`Failed to fetch secure image: ${error}`);
  }
}
