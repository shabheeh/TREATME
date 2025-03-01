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
    await cloudinary.uploader.destroy(oldPublicId);

    const fileStr = newImage.buffer.toString("base64");
    const fileUri = `data:${newImage.mimetype};base64,${fileStr}`;
    const resourceType = getResourceType(newImage.mimetype);

    const uploadResponse = await cloudinary.uploader.upload(fileUri, {
      folder,
      resource_type: resourceType,
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
