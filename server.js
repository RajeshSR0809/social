import mongoose from "mongoose";
import config from "./config.js";
import app from "./express.js";


console.log(config.mongoURI)

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.connection.on("error", () => {
    throw new Error(`unable to connect to database: ${config.mongoURI}`);
});


app.listen(config.port, (err) => {
    if(err){
        console.log(err)
    }
    console.info('Server started on port %s.', config.port)
});