var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var regiRouter = require('./routes/user/register');
var getcodeRouter = require('./routes/user/getcode');
var loginRouter = require('./routes/user/login');
var profileRouter = require('./routes/user/profile');
// var firstRouter = require('./routes/first');
var cateRouter = require('./routes/user/category');
var payRouter = require('./routes/user/pay');
var billRouter = require('./routes/user/bill');
var MprofileRouter = require('./routes/manager/Mprofile');
// var uppswRouter = require('./routes/updatepsw');
var MhomeRouter = require('./routes/manager/Mhome');
var MorderRouter = require('./routes/manager/Morder/Morder');
var DFileRouter = require('./routes/manager/Morder/execl_data');
var MmenusRouter = require('./routes/manager/Mmenus');
var MmemberRouter = require('./routes/manager/Mmember');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/images')));

app.use('/register', regiRouter);
app.use('/getcode', getcodeRouter);//wx.getuserInfo使用，获取openid
app.use('/login', loginRouter);
app.use('/profile', profileRouter);
// app.use('/first', firstRouter);
app.use('/category', cateRouter);
app.use('/pay', payRouter);
app.use('/bill', billRouter);
app.use('/mprofile', MprofileRouter);
app.use('/mhome', MhomeRouter);
app.use('/morder', MorderRouter);
// app.use('/updatepsw', uppswRouter);
app.use('/execl_data', DFileRouter);
app.use('/mmenus', MmenusRouter);
app.use('/mmember',MmemberRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
