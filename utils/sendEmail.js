const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });
  const mailoption = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailoption);
};
module.exports = sendEmail;
//email handlebars template
// const path = require("path");
// var nodemailer = require("nodemailer");
// var hbs = require("nodemailer-express-handlebars");

// var transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "vasllclothing@gmail.com",
//     pass: "vaslclothing8275",
//   },
// });

// const handlebarOptions = {
//   viewEngine: {
//     extName: ".handlebars",
//     partialsDir: path.resolve("./views"),
//     defaultLayout: false,
//   },
//   viewPath: path.resolve("./views"),
//   extName: ".handlebars",
// };

// transporter.use("compile", hbs(handlebarOptions));

// var mailOptions = {
//   from: "vasllclothing@gmail.com",
//   to: "muhammadhamza7022@gmail.com",
//   subject: "Sending Email using Node.js",
//   template: "email",
//   context: {
//     title: "Title Here",
//     text: "Lorem ipsum dolor sit amet, consectetur...",
//   },
// };

// transporter.sendMail(mailOptions, function (error, info) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Email sent: " + info.response);
//   }
// });
