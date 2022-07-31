const app = require("./app");

const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const cdatabse = require("./config/databse");

cdatabse();
//cloudinary

//4 error
// (uncaught error) kehty jo variable declre naw ho
//ye ye hum ny glt variable ko consoe krwany k liye nya jo k decalre hi ni
process.on("uncaughtException", (err) => {
  console.log("Shutting Down The Server due to Uncaught Exception");
  console.log(`Error:${err.message}`);
  process.exit(1);
});
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
//3 error

//(unhandle promise rejection) error means mongodb ki string glt dl dy
process.on("unhandledRejection", (err) => {
  //ye build in function ha sb kuch
  console.log("Shutting Down The Server due to Unhandled promise Rejection");
  console.log(`Error,${err.message}`); //ye message aye hamei k kia error ha
  server.close(() => {
    //ye hum ny jldi sy server close kr diya or bd mein call back function dy k osy exit kr diya is process sy
    process.exit(1);
  });
});
