const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  //orderitems aray mein push kiya email send krny k liye
  let array = [];
  order.orderItems.forEach((d) => {
    const prod = {
      name: d.name,
      quantity: d.quantity,
      price: d.price,
      imgurl: d.image,
    };
    array.push(prod);
  });
  array.forEach((d) => {
    (ordername = d.name),
      (orderquantity = d.quantity),
      (orderprice = d.price),
      (orderimgurl = d.image);
  });
  console.log(ordername);

  const message = `Thank You! For shop at VASL`;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve(__dirname, ".././views"),
      defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, ".././views"),
    extName: ".handlebars",
  };

  transporter.use("compile", hbs(handlebarOptions));
  const mailoption = {
    from: process.env.SMPT_MAIL,
    to: shippingInfo.email,
    subject: "VASL CLOTHES SHOPPING",
    text: message,
    context: {
      orderId: order._id,
      Name: shippingInfo.name,
      Date: order.createdAt,
      name: ordername,
    },

    template: "template",
  };
  transporter.sendMail(mailoption, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  await transporter.sendMail(mailoption);
};
module.exports = sendEmail;
