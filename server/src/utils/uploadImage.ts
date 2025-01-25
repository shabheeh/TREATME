
import cloudinary from '../configs/cloudinary';


export async function uploadToCloudinary(
  file: Express.Multer.File,
  folder: string
): Promise<{ url: string, publicId: string }> {
  try {

    const fileStr = file.buffer.toString('base64');
    const fileUri = `data:${file.mimetype};base64,${fileStr}`;
    

    const uploadResponse = await cloudinary.uploader.upload(fileUri, {
      folder,
      resource_type: 'auto',
    });

    return {
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id
    };
    
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
}



export async function updateCloudinaryImage(
  oldPublicId: string, 
  newImage: Express.Multer.File,
  folder: string
) {

  try {

    await cloudinary.uploader.destroy(oldPublicId);
    
    const fileStr = newImage.buffer.toString('base64');
    const fileUri = `data:${newImage.mimetype};base64,${fileStr}`;
    
    const uploadResponse = await cloudinary.uploader.upload(fileUri, {
      folder,
      resource_type: 'auto'
    });

    return {
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id
    };
    
  } catch (error) {
    console.error('Error updating Cloudinary image:', error);
    throw new Error('Failed to update image');
  }
}
