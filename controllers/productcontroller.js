const product = require("../models/productmodel"); //ye model bnya wa database mein
const Errorhandler = require("../utils/errorhandler"); //ye hum ny product error k liye bnya mtlb glt id dy user to server bnd naw ho
const catchasyncerror = require("../middleware/asyncerror.js"); //ye asunc error k liye bnya ha hum nyk sync method k sth agr hum aawait useni krty to server close naw ho mtlb try catch bnadiya comon middleware mein or is k andr hum ny function dy diya apna or hum createein agr required field naw day jesy name tb b error a jta tha servor bnd h jta tha
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
//createproduct -- Admin
exports.newproduct = catchasyncerror(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      publicid: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;

  req.body.user = req.user.id;
  const products = await product.create(req.body);
  res.status(201).json({
    success: true,
    products,
    message: "Product Created Successfully",
  });
});
//Getproduct All
exports.allproduct = catchasyncerror(async (req, res) => {
  //ye searc ki comand di ha k search krey product.find query ha or req.query jo querystr ha
  // let resultperpage = 12;
  // const productcount = await product.countDocuments();
  // let apifeat = new ApiFeatures(product.find(), req.query)
  //   .search()
  //   .filter()

  //   let allproducts  = await apifeat.query;

  //   let filteredProductsCount = allproducts.length;

  //   apifeat.pagination(resultperpage);
  //    allproducts  = await apifeat.query;
  const resultperpage = 8;
  const productcount = await product.countDocuments();

  const apiFeature = new ApiFeatures(product.find(), req.query)
    .search()
    .filter();
  //.pagination(resultperpage)
  //  let allproducts = await apiFeature.query.clone();

  //  let filteredProductsCount =  allproducts.length;

  // apiFeature.pagination(resultperpage);

  allproducts = await apiFeature.query;

  res.status(200).json({
    success: true,
    allproducts,
    productcount,
    resultperpage,
    //  filteredProductsCount,
  });
});
//get all admin products
exports.allproductadmin = catchasyncerror(async (req, res) => {
  const prod = await product.find();
  res.status(200).json({
    success: true,
    prod,
  });
});

//updateproduct -- Admin
exports.updateproduct = catchasyncerror(async (req, res, next) => {
  let uproduct = await product.findById(req.params.id);
  if (!uproduct) {
    return next(new Errorhandler("Product Not Found", 404)); //ly class bnae v utils mein phir ye error bnya wa sb sy phir middleare ein erro.js bnae
  }
  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < uproduct.images.length; i++) {
      await cloudinary.v2.uploader.destroy(uproduct.images[i].publicid);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        publicid: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  uproduct = await product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    uproduct,
    message: "Product Update Successfully",
  });
});
//one Product
exports.singleproduct = catchasyncerror(async (req, res, next) => {
  const sproduct = await product.findById(req.params.id);
  if (!sproduct) {
    return next(new Errorhandler("Product Not Found", 404));
  }
  res.status(200).json({
    success: true,
    sproduct,
  });
});

//Delete Product---Admin
exports.deleteproduct = catchasyncerror(async (req, res, next) => {
  const dproduct = await product.findById(req.params.id);
  if (!dproduct) {
    return next(new Errorhandler("Product Not Found", 404));
  }
  // Deleting Images From Cloudinary
  for (let i = 0; i < dproduct.images.length; i++) {
    await cloudinary.v2.uploader.destroy(dproduct.images[i].publicid);
  }

  await dproduct.remove();
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});
//create New Review or Update Review
exports.productreview = catchasyncerror(async (req, res, next) => {
  const { ratings, comment, productid } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(ratings),
    comment,
  };
  const rproduct = await product.findById(productid);
  const isreview = await rproduct.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isreview) {
    rproduct.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        (rev.rating = ratings), (rev.comment = comment);
      }
    });
  } else {
    rproduct.reviews.push(review);
    rproduct.numofreviews = rproduct.reviews.length;
  }
  let avg = 0;
  rproduct.reviews.forEach((rev) => {
    avg = avg + rev.rating;
  });
  rproduct.ratings = avg / rproduct.reviews.length;
  await rproduct.save({ validatorBeforsave: false });
  res.status(200).json({
    success: true,
  });
});
//getallreviews
exports.allreviews = catchasyncerror(async (req, res, next) => {
  const allproduct = await product.findById(req.query.id);
  if (!allproduct) {
    return next(new Errorhandler("Product Not Found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: allproduct.reviews,
  });
});
//delete reviews
exports.deletereview = catchasyncerror(async (req, res, next) => {
  const dproduct = await product.findById(req.query.productid);
  if (!dproduct) {
    return next(new Errorhandler("Product Not Found", 404));
  }
  const reviews = dproduct.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  let avg = 0;
  reviews.forEach((rev) => {
    avg = avg + rev.rating;
  });
  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numofreviews = reviews.length;

  await product.findByIdAndUpdate(
    req.query.productid,
    {
      reviews,
      ratings,
      numofreviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
  });
});
