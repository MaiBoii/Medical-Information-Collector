const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const session = require('express-session');
const nunjucks = require('nunjucks');
const passport = require('passport');

dotenv.config();
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');   
const profileRouter = require('./routes/profile');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
passportConfig(); // Passport 설정
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스에 연결 성공하였습니다.');
    })
    .catch((err) => {
        console.error(err);
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('asdasdasd'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'asdasdasd',
    cookie: {
      httpOnly: true,
      secure: false,
    },
  }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
})

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
  });

app.listen(app.get('port'), () => {
    console.log(app.get('port'),'번 포트에서 실행 중입니다.');
});

