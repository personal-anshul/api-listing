var express = require('express'),
  app = express(),
  http = require('http'),
  mongoose = require('mongoose'),
  fs = require("fs"),
  url = 'mongodb://localhost:27017/users',
  favicon = require('serve-favicon');

mongoose.connect(url);

//enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(favicon(__dirname + '/public/images/favicon.ico'));

var UserSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: Number,
    profession: String,
    created_at: Date
  }),
  User = mongoose.model('User', UserSchema);

//api to list all records
app.get('/listAll', function (req, res, next) {
  // get all the users
  User.find({}, function(err, users) {
    if (err) {
      console.log(err);
    }
    else {
      if(users) {
        res.end(JSON.stringify(users));
      }
    }
  });
});

//api to add record into list
app.get('/add', function (req, res, next) {
  //create user model
  var newUser = new User({
    "name" : req.query.name,
    "password" : req.query.password,
    "age": req.query.age,
    "profession" : req.query.profession
  });

  //Lets save it
  newUser.save(function (err, userObj) {
    if (err) {
      console.log(err);
      if(err.code == 11000) {
        res.end("Duplicate record so not saved.");
      }
      else {
        res.end("Server error, record is not saved.");
      }
    }
    else {
      res.end("Record saved successfully.");
    }
  });
})

//api to delete specific record
app.get('/delete/:id', function (req, res, next) {
  User.findOneAndRemove({"_id": req.params.id}, function(err) {
    if (err) {
      console.log(err);
    }
    else {
      res.end("User successfully deleted");
    }
  });
});

//api to get specific record
app.get('/:id', function (req, res, next) {
  // get all the users
  User.find({"_id": req.params.id}, function(err, userInfo) {
    if (err) {
      console.log(err);
    }
    else {
      if(userInfo.length) {
        res.end(JSON.stringify(userInfo));
      }
      else
        res.end("No record found.");
    }
  });
});

//server config
var server = http.createServer(app);
server.listen(8085, function () {
  var port = server.address().port;
  console.log("API server is running at:%s", port);
});
