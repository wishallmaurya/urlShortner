const urlModel = require('./model')
const validUrl = require('valid-url');
const shortId = require('shortid');
const redis = require("redis");

const { promisify } = require("util");
const { profile } = require('console');


const redisClient = redis.createClient(
    11501,
    "redis-11501.c212.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("3OJK8tLK2O7t28o9Qgc4vrpO0z9APQ3A", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});
//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length == 0) return false;
    return true;
}
exports.createurl = async function (req, res) {
    try {
        let data = req.body;

        if (!isValid(data.longUrl)) {
            return res.status(400).send({ status: false, message: "write your longUrl its mandatory" })
        }
        if (!validUrl.isUri(data.longUrl)) {
            return res.status(400).send({ status: false, message: "longUrl is invalid" })
        }
        
        checkUniqueUrl = await urlModel.findOne({ longUrl: data.longUrl })
        if (checkUniqueUrl) {
            return res.status(400).send({ status: false, message: "link is already shorted", data: checkUniqueUrl })
        }
        const fixUrl = "http://localhost:3000/"
        const urlCode = shortId.generate()
        const shortUrl = fixUrl + urlCode
        
        data.urlCode = urlCode
        data.shortUrl = shortUrl
        

        let savedData = await urlModel.create(data);
        savedData = savedData.toObject()
        delete savedData.__v
        delete savedData._id
        console.log(savedData)
        res.status(201).send({ status: true, data: savedData});
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
};
exports.redirectUrl = async function (req, res) {
    try {
        let {urlCode} = req.params.urlCode
        const chkUrlCode1 = await GET_ASYNC(`${req.params.urlCode}`)
        let chkUrlCode = JSON.parse(chkUrlCode1);
        // console.log(chkUrlCode)

            if (chkUrlCode) {
                return res.redirect(302,chkUrlCode.longUrl)
            }
            else {
                var profile = await urlModel.findOne({urlCode:urlCode});
                console.log(profile)
                if (!profile){
                    return res.status(404).send({ status: false, message: "Url Not Found!" })
                }
                await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(profile))
                console.log(profile.longUrl)
                res.redirect(302,profile.longUrl)
                
            }

    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
};
