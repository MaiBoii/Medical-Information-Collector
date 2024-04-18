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

//환자 리스트 페이지
router.get('/patient', async (req, res, next ) => {
    try{
        const patients = await Patient.findAll();
        res.render('patient', { 
            patients 
        });
    } catch (err){
        console.error(err);
        next(err);
    }
  });

// 환자 정보 조회 페이지 라우팅
router.get('/patient/:id', async (req, res, next) => {
    try {
      const patientId = req.params.id;
      const patient = await Patient.findByPk(patientId); // 환자 정보 조회
        if (!patient) {
            return res.status(404).send('존재하지 않는 환자입니다.');
        }
      res.render('profile', { 
        patient 
    });
    } catch (err){
        console.error(err);
        next(err);
    }
  });

//병원 관계자 로그인
router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('login', { title: '로그인 - HealthCare' });
});

//병원 관계자 정보 등록
router.get('/register', isNotLoggedIn, (req, res) => {
    res.render('register', { title: '관리자 등록 - HealthCare' });
});

router.get('/test', (req, res) => {
    console.log('test');
    res.render('test', { title: '실험용 - HealthCare' });
});

module.exports = router;