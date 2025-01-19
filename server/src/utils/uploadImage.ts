
import cloudinary from '../configs/cloudinary';


export async function uploadToCloudinary(
  file: Express.Multer.File,
  folder: string
): Promise<{ url: string }> {
  try {

    const fileStr = file.buffer.toString('base64');
    const fileUri = `data:${file.mimetype};base64,${fileStr}`;
    

    const uploadResponse = await cloudinary.uploader.upload(fileUri, {
      folder,
      resource_type: 'auto',
    });

    return {
      url: uploadResponse.secure_url,
    };
    
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
}