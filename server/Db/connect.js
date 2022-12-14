const mongoose = require('mongoose');

const connect = async (req, res) => {
    try {
        await mongoose.connect(
            `mongodb+srv://pmthuan:pmthuan@projectmovie.t2pnscz.mongodb.net/?retryWrites=true&w=majority`,
        );
        console.log('Connect database successfully!');
    } catch (error) {
        console.log(error);
    }
};

module.exports = connect;