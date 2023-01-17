const twilio = require("twilio");

function userSMS(userNumber) {
  const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  client.messages
    .create({
      body: "Your testSMS verification code is:",
      from: process.env.TWILIO_PHONE_NUMBER,
      to: userNumber,
    })
    .then((message) => console.log(message))
    .done();

  //   client.verify
  //     .services(process.env.TWILIO_VERIFY_SERVICE_SID)
  //     .verifications.create({ to: userNumber, channel: "sms" })
  //     .then((verification) => console.log(verification.status))
  //     .done();
}
module.exports = { userSMS };
