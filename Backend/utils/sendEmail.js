
import nodeMailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const options = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: subject,
    text: message,
  };
  await transporter.sendMail(options);
};






// export const sendEmail = async({email , subject, message}) => {
//    try{
//     console.log("Initializing email transport...");

//     const transporter = nodeMailer.createTransport({
//         // host : process.env.SMTP_HOST,
//         // port : process.env.SMTP_PORT,
//         // service : process.env.SMTP_SERVICE,
       
//         service: "gmail",
//         auth : {
//             // user : process.env.SMTP_MAIL,
//             // pass : process.env.SMTP_PASSWORD,
//             user: "royanshul151103@gmail.com" ,
//             pass: "kjfzdnigxnwcrvmh"
//         }
//     });

//     console.log("Transporter initialized. Preparing email options...");

//     const options = {
//         // from : process.env.SMTP_MAIL,
//         from:"royanshul151103@gmail.com",
//         to : email,
//         subject: subject,
//         text : message
//     }
//     console.log(`Sending email to: ${email}, Subject: ${subject}`);

//     await transporter.sendMail(options);
//     console.log("Email sent successfully!");
//    }
//     catch (error) {
//         console.error("Error while sending email:", error);
//         return false;
//     }
// }
