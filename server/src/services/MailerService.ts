import { getEmailTransporter } from "src/configs/nodemailer";


class MailerService {
    private emailTransporter;
  
    constructor() {
      this.emailTransporter = getEmailTransporter(); 
    }
  
    async sendEmail(to: string, subject: string, text: string): Promise<void> {
      await this.emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
      });
    }
  }
  
  export default MailerService;
  

  