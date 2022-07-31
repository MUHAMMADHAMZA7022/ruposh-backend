// class Apifeatures {
//   constructor(
//     query,
//     querystr //query mtlb find method call ho or os mein jo querystr ha wo mtlb kia find kna
//   ) {
//     this.query = query;
//     this.querystr = querystr;
//   }
//   search() {
//     //ye querystr jo user likh rha ho ga search ka or query jaha sy cl howa find method get all product ka
//     const keyword = this.querystr.keyword
//       ? {
//           name: {
//             $regex: this.querystr.keyword,
//             $options: "i",
//           },
//         }
//       : {};
//     this.query = this.query.find({ ...keyword }); 
//     return this;
//   }
  
//   filter() {
//     const querycopy = { ...this.querystr }; //ye refernce k though diya ha ab ye chnging ni krey ga main mein jo chnge ho ga is variable mein ho ga
//     //console.log(querycopy);//ye delete sy phly agr hum keyword b select krein to sb dikhaye ga
//     const removefields = ["keyword", "page", "limit"]; //ye remove kr di ha hum ny
//     removefields.forEach((key) => delete querycopy[key]); //ye delete kr di
//     //  console.log(querycopy);//ye delete krny k bd wala dikhaye ga

//     //price and rating filter
//     let querystr = JSON.stringify(querycopy); //ye strig mein convert kiya
//     querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g, (repl) => `$${repl}`); //ye replace method ha build in ye mongodb k regular expression ko convert kiya string mein
//     this.query = this.query.find(JSON.parse(querystr)); // ye find kr rha ha  string mein convert kr diya object bnya ha
//     return this;
//   }
//   pagination(resultperpage) {
//     const currentpage = Number(this.querystr.page) || 1;
//     const skip = resultperpage * (currentpage - 1);
//     this.query = this.query.limit(resultperpage).skip(skip);
//     return this;
//   }
// }
// module.exports = Apifeatures;
class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    //   Removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter For Price and Rating

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;