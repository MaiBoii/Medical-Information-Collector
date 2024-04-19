const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Patient } = require('../models');

const router = express.Router();

//로그인 여부에 따라 다른 페이지 렌더링
router.use((req, res, next) => {
    res.locals.user = req.user;
    console.log('res.locals.user', res.locals.user);
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
        console.log('왠지모를에러가 발생했슴둥')
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

  // 전체 환자 정보 통계 페이지 라우팅
router.get('/chart', async (req, res, next) => {
    try {
        const patients = await Patient.findAll(); // 모든 환자를 가져옵니다.

        const statusCount = {
            '안전': 0,
            '주의': 0,
            '위험': 0
        };

        patients.forEach(patient => {
            statusCount[patient.status]++;
        });

        const chartData = {
            labels: ['안전', '주의', '위험'],
            datasets: [{
                label: '환자 상태',
                backgroundColor: ['rgb(54, 162, 235)',
                                  'rgb(255, 205, 86)',
                                  'rgb(255, 99, 132)'],
                data: [statusCount['안전'], statusCount['주의'], statusCount['위험']]
            }]
        };

        res.render('chart', { chartData });

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// //병원 관계자 로그인
// router.get('/chart', (req, res) => {
//     res.render('chart', { title: '통계 - HealthCare' });
// });

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