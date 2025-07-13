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

    const params = {
      Destination: { ToAddresses: [email] },
      Message: {
        Body: {
          Text: { Data: `Your WellSaid verification code is: ${code}` }
        },
        Subject: { Data: 'Your WellSaid Login Code' }
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
