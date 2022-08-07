const express = require("express");
const app = express();
const path = require('path')
// require('dotenv').config({ path: path.resolve(__dirname, '../backend/config/config.env') })
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
const fileupload = require("express-fileupload");
app.use(fileupload());
const coookieparser = require("cookie-parser");
const session = require('express-session');
app.use(coookieparser());
app.set("trust proxy",1);
app.use(session({
  name:"hamza",
  secret:process.env.JWT_SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    path:"/",
    secure:true,
    httpOnly:true,
    sameSite:'none',
  }

}))
const cors = require("cors");
const corsOptions = {
  origin: "https://vasl-brand.web.app/",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

if (process.env.NODE_ENV !== "PRODUCTION") {
require('dotenv').config({ path: path.resolve(__dirname, './config/config.env') })
}
app.get("/",(req,res)=>{
  res.send("Hello Backend")
})
//middleware for error
const errormiddleware = require("./middleware/error");


//Route import krwaye
const product = require("./routers/productroute");
app.use("/api/vasal", product); //ye product ka sb ka 1 url ha agey routes mein ja k chnge kiye wy create update url

//Route import krwaye
const user = require("./routers/userroute");
app.use("/api/vasal", user); //ye user ka sb ka 1 url ha agey roues mein ja k chnge kiye wy create update url

//Route import krwaye
const order = require("./routers/orderroute");
app.use("/api/vasal", order); //ye order ka sb ka 1 url ha agey roues mein ja k chnge kiye wy create update url

app.use(errormiddleware);
module.exports = app;
