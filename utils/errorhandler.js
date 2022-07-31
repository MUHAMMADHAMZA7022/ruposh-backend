 class Errorhandler extends Error {
     constructor(message, statuscode) {
         super(message)
         this.statuscode = statuscode
         Error.captureStackTrace(this, this.constructor); //ye hum ny use kiya ha error jo hamry status code any naw prouct found py ye kro or status code ye sb ka common bna diya ha
     }
 }
 module.exports = Errorhandler;
 //ye clss bnae v statuscode or message ki jo main use krni hum ny stacktrace krta error