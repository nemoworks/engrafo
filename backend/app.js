var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var outgoingRouter = require("./routes/outgoing");
var accountRouter = require("./routes/account");
var LCtemplates = require("./routes/LCtemplates");
var FStemplates = require("./routes/FStemplates");
var context = require("./routes/context");
var app = express();
var cors = require('cors')

app.use(cors()) 
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
app.set("view engine", "pug");

app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended: false }));
// app.use(express.static(path.join(__dirname, "../frontend/build", "index.html")));

// app.use("/", (req, res) => {
//   // res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
//   res.send({
//     message: "express"
//   })
// })
app.use("/api/outgoing", outgoingRouter);
app.use("/api/account", accountRouter);
app.use("/api/LCtemplates", LCtemplates);
app.use("/api/FStemplates", FStemplates);
app.use("/api/context", context);
// app.use("/swagger-ui", express.static("../swagger-ui"));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({
    message: "error"
  });
});

app.use('/',function(req,res,next){
  console.log('hello')
  next()
})

module.exports = app;
