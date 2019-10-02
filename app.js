var express = require("express");
var app = express();
var router = express.Router();
var Tenant = require("./models/tenant.model")

var multer = require('multer');

var config = require('./config')
var jwt = require('jsonwebtoken');

var cors = require('cors');
var mongoose = require("mongoose");
var bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended : true}));
app.use(bodyparser.json());

//mongodb connection start
mongoose.connect("mongodb://localhost/refixd123", { useNewUrlParser: true },function(err){
if(err){
    console.log('The error is ',err)
}
else{
console.log('The database connected')
}
})
//mongodb connection end

var checkJWT = function (req, res, next) {
    
    console.log("==>inside jwt"+req.headers.token);
    if(req.headers.token != undefined ){
        console.log("token present");
        jwt.verify(req.headers.token, config.secret, function (err, data) {
            if (err) {
                res.json({
                    status: false,
                    message: err
                })
            }
            else {
                req.user = data;
                next();//move to next routing
            }

        })
    }
    else{
        console.log("token not present");
        res.json({
            status : false,
            message : "Token not present"
        })
    }
}

router.post('/login', function (req, res) {

    if (req.body.email == "admin@gmail.com" && req.body.password == "12345") {
        const user = {
            name: "Admin",
            age: 21
        }

        var token = jwt.sign(user, config.secret);
        res.json({
            status: true,
            token: token
        })
    }

})

//tenant start

// SET STORAGE
var storage = multer.diskStorage({
	
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        console.log("the file is ", file);
      cb(null, file.originalname);
    }
}) 
var upload = multer({ storage: storage })

router.post('/tenants', upload.single('pan'), upload.single('aadhar'), function(req,res){

    var tent = new Tenant();

    tent.name = req.body.name;
    tent.address = req.body.address;

    const pan = req.body.pan.replace("C:\\fakepath\\", "");
    const aadhar = req.body.aadhar.replace("C:\\fakepath\\", "");
    tent.pan = pan;
    tent.aadhar = aadhar;

   //tent.pan = req.files.pan[0].originalname;
   //tent.aadhar = req.files.aadhar[0].originalname;
    tent.save();
    res.json({
        status : true,
        message : "Tenant saved successfully!"
    })

})

router.get('/tenants',function(req,res){
    Tenant.find({},function(err,tenants){
        if(err){
            res.json({
                status : false,
                error : err
            })
        }
        else{
            res.json({
                status : true,
                tenants : tenants
            })
        }
    })
})
//tenant end

app.use(cors());

app.use('/api/admin', router);
app.listen(config.port, function () {
    console.log('The server running on port number ' + config.port)
})