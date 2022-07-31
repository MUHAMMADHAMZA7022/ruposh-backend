const express = require("express");
const router = express.Router();
const {
  newproduct,
  singleproduct,
  updateproduct,
  allproduct,
  deleteproduct,
  productreview,
  allreviews,
  deletereview,
  allproductadmin,
} = require("../controllers/productcontroller"); //ye import krwaya ha create product jaha sbfunctionality pri v
const authenticate = require("../middleware/auth");
router
  .route("/admin/products")
  .get(authenticate, authorizerole("admin"), allproductadmin);
router
  .route("/admin/newproduct")
  .post(authenticate, authorizerole("admin"), newproduct); //yha url chnge krty rho create ka banana ya jes ka b bnana
router.route("/allproducts").get(allproduct); //yha url chnge krty rho all ka banana ya jes ka b bnana
router.route("/oneproduct/:id").get(singleproduct); //yha url chngse krty rho get ka banana ya jes ka b bnana
router
  .route("/admin/product/:id")
  .put(authenticate, authorizerole("admin"), updateproduct); //yha url chnge krty rho update ka banana ya jes ka b bnana
router
  .route("/admin/product/:id")
  .delete(authenticate, authorizerole("admin"), deleteproduct); //yha url chnge krty rho delete ka banana ya jes ka b bnana
router.route("/reviews").put(authenticate, productreview);
router.route("/allreviews").get(allreviews).delete(authenticate, deletereview);

module.exports = router;
