exports.handler = async (event) => {
  const session = event.request.session;

  if (session.length === 0) {
    event.response.challengeName = 'CUSTOM_CHALLENGE';
    event.response.issueChallenge = true;
    event.response.failAuthentication = false;
  } else if (
    session.length > 0 &&
    session[session.length - 1].challengeResult === true
  ) {
    event.response.issueChallenge = false;
    event.response.failAuthentication = false;
  } else if (
    session.length >= 3 &&
    session[session.length - 1].challengeResult === false
  ) {
    event.response.issueChallenge = false;
    event.response.failAuthentication = true;
  } else {
    event.response.challengeName = 'CUSTOM_CHALLENGE';
    event.response.issueChallenge = true;
    event.response.failAuthentication = false;
  }

  return event;
};
