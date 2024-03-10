

const create = (req, res, next) => {
    res.status(200).json({value: "able to reach the user create controller"});
}


export default {
    create
};