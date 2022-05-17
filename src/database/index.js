const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(
        () => console.log("Database connected successfully."),
    ).catch(
        err => console.log("Error while connecting with database: " + err)
    )
mongoose.Promise = global.Promise;
module.exports = mongoose;