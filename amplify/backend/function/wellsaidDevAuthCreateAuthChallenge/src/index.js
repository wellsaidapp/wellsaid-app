const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const ses = new SESClient();

exports.handler = async (event) => {
  if (
    event.request.session.length === 0 ||
    (event.request.session.length === 1 &&
      event.request.session[0].challengeResult === true)
  ) {
    const email = event.request.userAttributes.email;
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const htmlBody = `
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
          <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.05);">
            <tr>
              <td style="padding:30px 30px 20px; text-align:center; background:#ffffff;">
                <img src="https://wellsaidapp-static.s3.us-east-2.amazonaws.com/Company/Branding/wellsaid-medium.png" alt="WellSaid Logo" width="200" style="max-width:100%; height:auto; margin-bottom:10px;" />
              </td>
            </tr>
            <tr>
              <td style="padding:40px 30px 20px; text-align:center;">
                <p style="font-size:16px; color:#333333; margin-bottom:30px;">
                  Use the code below to log in to your WellSaid App account:
                </p>
                <div style="background:#4c89fe; padding:20px; border-radius:10px; display:inline-block; margin-bottom:30px;">
                  <p style="color:#ffffff; font-size:14px; letter-spacing:1px; text-transform:uppercase; margin:0 0 10px;">Your Login Code</p>
                  <p style="color:#ffffff; font-size:32px; font-weight:bold; letter-spacing:6px; margin:0; font-family:'Courier New', monospace;">${code}</p>
                </div>
                <p style="font-size:15px; color:#666666; margin-bottom:30px; line-height:1.5;">
                  Enter this 6-digit code in the WellSaid app to log in. This code will expire in 10 minutes.
                </p>
                <div style="background:#eaf3ff; border:1px solid #c3ddf6; border-radius:8px; padding:15px; font-size:13px; color:#2c5282; line-height:1.5;">
                  <strong>Note:</strong> If you didn't request this login, you can safely ignore this email.
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:30px 30px; text-align:center; background-color:#f8f9fa; border-top:1px solid #e9ecef;">
                <img src="https://wellsaidapp-static.s3.us-east-2.amazonaws.com/Company/Branding/well-medium.png" alt="WellSaid icon" width="32" style="margin-bottom:10px;" />
                <p style="font-size:14px; color:#666666; margin:10px 0;">
                  One thoughtful prompt at a time, you're creating a living archive of insight and connection.
                </p>
                <p style="font-size:13px; color:#999999; margin-top:20px;">
                  © 2025 WellSaid App. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const params = {
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: 'Your WellSaid App Login Code' },
        Body: {
          Text: { Data: `Your WellSaid app login code is: ${code}` },
          Html: { Data: htmlBody }
        }
      },
      Source: 'hello@wellsaidapp.com'
    };

    try {
      await ses.send(new SendEmailCommand(params));
    } catch (err) {
      console.error('SES send failed:', err);
      throw err;
    }

    event.response.publicChallengeParameters = { email };
    event.response.privateChallengeParameters = { answer: code };
    event.response.challengeMetadata = `CODE-${code}`;
  }

  return event;
};
