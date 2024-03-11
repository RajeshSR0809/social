const getErrorMessage = (error) => {
    let message = "";
    if(error.code){
        if(error.code == 11000 || error.code == 11001){
            message = "unique field error";
            console.error(error);
        }
        else {
            message = "something went wrong";
        }
    }
    else {
        console.log(error)
        for(let errName in error.errors){
            if(error.errors[errName].message){
                message = error.errors[errName].message;
            }
        }        
    }
    return message;
};

export default {getErrorMessage};