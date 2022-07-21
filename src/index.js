const express = require('express');
const route = require('./route.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://wishall:vishal@atlascluster.p9u9uvd.mongodb.net/group30Database?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )



app.use('/', route);

app.use('*',(req,res)=>{
    return res.status(404).send({status:false,message:"write proper url"})
})



app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
