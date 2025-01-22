import logger from "../configs/logger";
import { getEmailTransporter } from "..//configs/nodemailer";

export const sendEmail = async (
  to: string,
  subject: string,
  text?: string, 
  html?: string  
): Promise<void> => {
  try {
    const emailTransporter = getEmailTransporter();

    if (!text && !html) {
      throw new Error("Either 'text' or 'html' content must be provided.");
    }

    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text, 
      html,
    });

    logger.info(`Email sent to ${to} with subject "${subject}"`);

  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send email");
  }
};
