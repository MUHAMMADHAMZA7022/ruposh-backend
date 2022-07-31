const Errorhandler = require("../utils/errorhandler"); //ye hum ny product error k liye bnya mtlb glt id dy user to server bnd naw ho
const catchasyncerror = require("../middleware/asyncerror.js"); //ye asunc error k liye bnya ha hum ny k sync method k sth agr hum aawait useni krty to server close naw ho mtlb try catch bnadiya comon middleware mein or is k andr hum ny function dy diya apna or hum createein agr required field naw day jesy name tb b error a jta tha servor bnd h jta tha
const User = require("../models/usermodel"); //ye model bnya wa database mein
const sendToken = require("../utils/getJwt");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const { OAuth2Client } = require("google-auth-library");
const { response } = require("express");

const client = new OAuth2Client(
  "1068904748671-ngjq97fgfjtgp3e82efhf4dmd09j4dkf.apps.googleusercontent.com"
);
//register
exports.registeruser = catchasyncerror(async (req, res, next) => {
  // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //   folder: "avatars",
  //   width: 150,
  //   crop: "scale",
  // });

  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "avatars/ezc3su14rpw1afcurdem",
      url: "https://res.cloudinary.com/vasal-clothings/image/upload/v1644650641/avatars/ezc3su14rpw1afcurdem.png",
    },
  });
  sendToken(user, 201, res);
});
//login
exports.loginuser = catchasyncerror(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new Errorhandler("Please Enter Email & Password", 400)); //ye khud errorhandler bnya wa ha
  }
  const user = await User.findOne({ email }).select("+password"); //password sedha is liye ni diya wa kio k upar false kiyawa tbhi select method use kiya
  if (!user) {
    return next(new Errorhandler("Invalid Email ", 401));
  }
  const passwordmatch = await user.comparePassword(password); //ye fuction bnya wa bcrpyt ka model mein compare k liye
  if (!passwordmatch) {
    return next(new Errorhandler("Invalid  password", 401));
  }
  sendToken(user, 200, res); //ye token bnya wa phly token bn rha or phir send kr rhy
});
//login with google
exports.googlelogin = (req, res) => {
  const { tokenId } = req.body;
  client
    .verifyIdToken({
      idToken: tokenId,
      audience:
        "1068904748671-ngjq97fgfjtgp3e82efhf4dmd09j4dkf.apps.googleusercontent.com",
    })
    .then((response) => {
      const { name, email, picture, email_verified } = response.payload;
      console.log(response.payload);
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (err) {
            return res.status(400).json({
              error: "This user doesn't exist signup first",
            });
          } else {
            if (user) {
              const token = user.getJWTToken(); //ye access kr rhy token models mein bnya wa ha

              const { _id, name, email, avatar } = user;
              sendToken(user, 200, res); //ye token bnya wa phly token bn rha or phir send kr rhy
            } else {
              let password = email + process.env.JWT_SECRE;
              // let avatar = response.profileObj.imageUrl;

              let newuser = new User({
                name,
                email,
                password,
                avatar: {
                  public_id: response.payload.picture,
                  url: response.payload.picture,
                },
              });

              newuser.save((err, data) => {
                if (err) {
                  return res.status(400).json({
                    error: "Something went wrong...",
                  });
                }
                console.log(data);
                sendToken(newuser, 200, res);
                // const token = user.getJWTToken(); //ye access kr rhy token models mein bnya wa ha

                // const { _id, name, email, avatar } = user;
              });
            }
          }
        });
      }
      console.log(response.payload);
    });
};
//logout
exports.logout = catchasyncerror(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});
//forgot password
exports.forgotpassword = catchasyncerror(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new Errorhandler("User Not Found", 404));
  }
  //Get resettoken save kiya databse mein
  const resettoken = user.Resetpasswordtoken(); //ye access kr k databse mein save kr liya token
  await user.save({ validateBeforeSave: false });
  //
  //const resetpasswordurl = `${req.protocol}://${req.get( "host")}/api/vasal/password/reset/${resettoken}`; //ye url bhja wa http ki jga protocol likha or host ki jga get host
  const resetpasswordurl = `${process.env.Frontend_Url}/password/reset/${resettoken}`; //localhost
  const message = `Your Password reset token is:-\n\n ${resetpasswordurl} \n\n If you have not requested this email then, please ignore it`; //ye mesaage jaye ga user ko
  try {
    await sendEmail({
      email: user.email,
      subject: "Vasal Password Recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email send to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetpasswordtoken = undefined;
    user.resetpasswordexpire = undefined; //ye undefined kiya k phly upar save krwa chuky ha error naw aye tbhi undefined kr k save kr diya wa
    await user.save({ validateBeforeSave: false }); //ye save kr liya hum ny
    return next(new Errorhandler(error.message, 500));
  }
});
// resetpassword
exports.resetpassword = catchasyncerror(async (req, res, next) => {
  const resetpasswordtoken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .toString("hex");
  const user = await User.findOne({
    resetpasswordtoken,
    resetpasswordexpire: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    return next(new Errorhandler("Reset Password Token is Expired", 404));
  }
  if (req.body.password !== req.body.conformpassword) {
    return next(new Errorhandler("Password Not Matched", 404));
  }
  user.password = req.body.password;
  user.resetpasswordtoken = undefined;
  user.resetpasswordexpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});
//get user detail
exports.getuserdetails = catchasyncerror(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

//update password
exports.updatepassword = catchasyncerror(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const passwordmatch = await user.comparePassword(req.body.oldpassword); //ye fuction bnya wa bcrpyt ka model mein compare k liye
  if (!passwordmatch) {
    return next(new Errorhandler("Old password Incorrect", 401));
  }
  if (req.body.newpassword !== req.body.conformpassword) {
    return next(new Errorhandler("Password Not Matched", 404));
  }
  user.password = req.body.newpassword;
  await user.save();
  sendToken(user, 200, res);
});
//update user profile
exports.updateprofile = catchasyncerror(async (req, res) => {
  const newuserdata = {
    name: req.body.name,
    email: req.body.email,
  };
  // //addd avtar cloudinary
  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newuserdata.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  const user = await User.findByIdAndUpdate(req.user.id, newuserdata, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
  });
});
//update user role(Admin)
exports.updaterole = catchasyncerror(async (req, res, next) => {
  const newuserdata = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  if (newuserdata.email === "muhammadhamza7022@gmail.com") {
    return next(new Errorhandler(`ADMIN Not UPDATED`));
  }
  const user = await User.findByIdAndUpdate(req.params.id, newuserdata, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "User role changed Successfully",
  });
});
//get all users(Admin)
exports.getallusers = catchasyncerror(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});
//get single user(Admin)
exports.getsingleuser = catchasyncerror(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new Errorhandler(`User Does Not exist this id:${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});
// user delete --(Admin)
exports.deleteuser = catchasyncerror(async (req, res, next) => {
  //we will remove cloudinary late
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new Errorhandler(`User Does Not exist this id:${req.params.id}`)
    );
  }
  if (user.email === "muhammadhamza7022@gmail.com") {
    return next(new Errorhandler(`ADMIN Not DELETED`));
  }
  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();
  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
