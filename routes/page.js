const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Patient } = require('../models');

const router = express.Router();

//로그인 여부에 따라 다른 페이지 렌더링
router.use((req, res, next) => {
    res.locals.admin = req.admin;
    next();
});

// 메인 페이지
router.get('/', (req, res) => {
    res.render('index', { title: '메인 페이지 - HealthCare' });
});

//환자 정보 프로필
router.get('/profile', (req, res) => {
    res.render('profile', { title: '환자 정보 - HealthCare' });
});

//환자 리스트 페이지
router.get('/patient', (req, res) => {
    res.render('patient', { title: '환자 리스트 - HealthCare' });
});

//병원 관계자 로그인
router.get('/login', (req, res) => {
    res.render('login', { title: '로그인 - HealthCare' });
});

//병원 관계자 정보 등록
router.get('/register', (req, res) => {
    res.render('register', { title: '관리자 등록 - HealthCare' });
});


//nunjucks 등록 테스트
router.get('/test', async (req, res, next ) => {
    try{
        const patients = await Patient.findAll();
        res.render('test', { 
            patients 
        });
    } catch (err){
        console.error(err);
        next(err);
    }
  });

module.exports = router;