export const generateBookingCancellationHtml = (
  doctor: string,
  patient: string,
  date: string,
  time: string
): string => {
  return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Booking Cancellation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f0f8ff;
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
            background-color: #ff6347;
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
            color: #ff6347;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #ff6347;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
          }
          .button:hover {
            background-color: #e65c4f;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Cancellation</h1>
          </div>
          <div class="content">
            <p>Dear Patient,</p>
            <p>Your appointment with <strong>Dr. ${doctor}</strong> has been cancelled.</p>
            <p>Here are the details of your cancelled appointment:</p>
            <ul>
              <li><strong>Date:</strong> ${date}</li>
              <li><strong>Time:</strong> ${time}</li>
              <li><strong>Patient:</strong> ${patient}</li>
            </ul>
            <p>Thank you for choosing TreatMe for your healthcare needs. We look forward to serving you in the future.</p>
            <p>Best regards,</p>
            <p>The <strong>TreatMe Team</strong></p>
            <p><a href="mailto:support@treatme.com">Contact Support</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
};
