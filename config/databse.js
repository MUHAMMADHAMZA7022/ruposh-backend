const mongoose = require("mongoose");
const connectdatabase = () => {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,

    }).then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.port}`);
    });
};
module.exports = connectdatabase;