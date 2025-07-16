import { api } from "../../utils/axiosInterceptor";

export const getMedia = async (
  resourceType: "image" | "video" | "raw" = "image",
  publicId: string
) => {
  try {
    return await api.get(`media/${resourceType}?publicId=${publicId}`, {
      responseType: "blob",
      withCredentials: true,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to get notifications: ${error.message}`, error);
      throw new Error(error.message);
    }

    console.error(`Unknown error occurred`, error);
    throw new Error("An unknown error occurred");
  }
};
