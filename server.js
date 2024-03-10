import { mongoose  } from "mongoose";
import config from "./config.js";
import app from "./express.js";


mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI);
mongoose.connection.on("error", (error) => {
    throw new Error(`unable to connect to database: ${config.mongoURI}`);
});


app.listen(config.port, (err) => {
    if(err){
        console.error(`failed to start the server on port %s`, config.port)
    }
    console.info('Server started on port %s.', config.port)
});