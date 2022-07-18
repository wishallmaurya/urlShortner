const urlModel = require('./model')
const validUrl = require('valid-url');
const shortId = require('shortid');


// const isValid = function (value) {
//     if (typeof value === "undefined" || value === null) return false;
//     if (typeof value === "string" && value.trim().length == 0) return false;
//     return true;
// }

exports.createurl = async function (req, res) {
    try {
        let data = req.body;
        
        // if (!isValid(data.longUrl)) {
        //     return res.status(400).send({ status: false, message: "write your longUrl its mandatory" })
        // }
        
        if (!validUrl.isUri(data.longUrl)){
            return res.status(400).send({ status: false, message: "longUrl is invalid" })} 

        
        checkUniqueUrl = await urlModel.findOne({ longUrl: data.longUrl })
        
    
        if (checkUniqueUrl) {
            return res.status(400).send({ status: false, message: "link is already shorted", data: checkUniqueUrl })
        }
        const fixUrl = "http://localhost:3000/"
        const urlCode = shortId.generate()
        const shortUrl = fixUrl + urlCode

        data.shortUrl=shortUrl
        data.urlCode=urlCode

        
        let savedData = await urlModel.create(data);
        res.status(201).send({ status: true, data: savedData });
    }

    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
};

exports.redirectUrl = async function (req, res){
    try {
        const urlCode = req.params.urlCode;
       
        const chkUrlCode = await urlModel.findOne({urlCode: urlCode})
        if (chkUrlCode) {
            return res.redirect(302,chkUrlCode.longUrl)
        }
        else{
            return res.status(404).send({status: false,message: "Url Not Found!"})
        }
    }  
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
};
