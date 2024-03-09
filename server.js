import { mongoose  } from "mongoose";
import config from "./config";
import app from "./express.js";


console.log(config.mongoURI)

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI, { useUnifiedTopology: true });
mongoose.connection.on("error", (error) => {
    if(error){
        console.log("error", error);
    }
    //throw new Error(`unable to connect to database: ${config.mongoURI}`);
});


app.listen(config.port, (err) => {
    if(err){
        console.log(err)
    }
    console.info('Server started on port %s.', config.port)
});