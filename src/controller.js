const urlModel = require('./model')
var validUrl = require('valid-url');

exports.createurl = async function (req, res) {
    try {
        let data = req.body;
        if (validUrl.isUri(data.url)){
            console.log('Looks like an URI');
        } else {
            console.log('Not a URI');
        }


        let savedData = await urlModel.create(data);
        res.status(201).send({ status: true, msg: "Success", data: savedData });
    }

    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
};
