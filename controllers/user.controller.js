

const create = (req, res, next) => {
    res.status(200).json({value: "able to reach the user create controller"});
}

const list = (req, res, next) => {
    res.status(200).json({value: "able to reach the server"});
}

const read = (req, res, next) => {};

const update = (req, res, next) => {};

const remove = (req, res, next) => {};

const userByID = () => {}

export default {
    create,
    list,
    userByID,
    read,
    update,
    remove
};