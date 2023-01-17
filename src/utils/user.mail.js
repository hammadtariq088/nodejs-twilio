const nodemailer = require("nodemailer");

async function userMail(userEmail, token) {
  // Create a transporter object
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.USER_EMAIL_ADDRESS,
      pass: process.env.GMAIL_SECRET_PASS,
    },
  });

  // Define the email options
  let mailOptions = {
    from: `"Hammad Tariq" <${USER_EMAIL_ADDRESS}>`,
    to: userEmail,
    subject: "Test",
    text: "Thanks for creating an account, please click the link given below to complete the registration process",
    html: `<h5>http://localhost:5000/users/verify?token=${token}</h5>`,
  };

  // Send the email
  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
}

userMail().catch(console.error);

module.exports = { userMail };
