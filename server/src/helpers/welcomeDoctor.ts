export const generateWelcomeDoctorHtml = (email: string, password: string): string => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Congratulations</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          background-color: #f9f9f9;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 20px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          background-color: #007bff;
          color: white;
          padding: 10px 0;
          border-radius: 5px 5px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 20px;
        }
        .content p {
          margin: 15px 0;
        }
        .content strong {
          color: #007bff;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to TreatMe!</h1>
        </div>
        <div class="content">
          <p>Dear Doctor,</p>
          <p>We are delighted to welcome you to TreatMe Your account has been successfully created. Below are your login credentials:</p>
          <ul>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Password:</strong> ${password}</li>
          </ul>
          <p>Please use the above credentials to log in to your account at <a href="http://localhost:5173/doctor/signin" target="_blank">TreatMe Platform</a>. For security purposes, we recommend updating your password as soon as you log in.</p>
          <p>If you have any questions or need assistance, feel free to contact our support team.</p>
          <p>Thank you for joining us, and we look forward to working with you to deliver exceptional care.</p>
          <p>Best regards,</p>
          <p>The <strong>TreatMe Team</strong></p>
          <p><a href="mailto:support@treatme.com">support@treatme.example.com</a></p>
        </div>
        
      </div>
    </body>
    </html>
    `;
  };
  