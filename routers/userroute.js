const express = require("express");
const router = express.Router();
const {
  registeruser,
  loginuser,
  logout,
  forgotpassword,
  resetpassword,
  getuserdetails,
  updatepassword,
  updateprofile,
  getallusers,
  getsingleuser,
  updaterole,
  deleteuser,
  googlelogin,
} = require("../controllers/usercontroller");
const auth = require("../middleware/auth");

router.route("/register").post(registeruser);
router.route("/login").post(loginuser);
router.route("/googlelogin").post(googlelogin);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotpassword);
router.route("/password/reset/:token").put(resetpassword);
router.route("/me").get(auth, getuserdetails);
router.route("/admin/allusers").get(auth, authorizerole("admin"), getallusers);
router
  .route("/admin/singleuser/:id")
  .get(auth, authorizerole("admin"), getsingleuser);
router
  .route("/admin/updaterole/:id")
  .put(auth, authorizerole("admin"), updaterole);
router
  .route("/admin/deleteuser/:id")
  .delete(auth, authorizerole("admin"), deleteuser);
router.route("/password/update").put(auth, updatepassword);
router.route("/profile/update").put(auth, updateprofile);
module.exports = router;
