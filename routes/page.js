const express = require('express');
const { isLoggedIn, isNotLoggedIn} = require('./middlewares');
const { Patient, Biometric } = require('../models');

async function evaluatePatientHealth({ oxygen_saturation, respiration_rate, heart_rate, temperature }) {
    let status = '안전';
  
    if (oxygen_saturation < 90 || respiration_rate < 12 || respiration_rate > 30 || heart_rate < 60 || heart_rate > 120 || temperature < 36.0 || temperature > 38.0) {
        status = '위험';
    } else if (oxygen_saturation < 95 || respiration_rate < 12 || respiration_rate > 20 || heart_rate < 60 || heart_rate > 100 || temperature < 36.5 || temperature > 37.5) {
        status = '주의';
    }
  
    return status;
  }

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


router.post('/', (req, res) => {
    const data = req.body;
    console.log(data);
    res.json({
        message: 'Data received',
        receivedData: data
    });
});


// Post 방식으로 Json 데이터를 받아서 환자 생체 정보 등록
// 생체 정보 등록 및 환자 상태 평가
router.post('/biometric', async (req, res, next) => {
    try {
        const { patient_id, oxygen_saturation, respiration_rate, heart_rate, distance_travelled, temperature } = req.body;

        // 생체 정보 저장
        const biometric = await Biometric.create({
            patient_id,
            oxygen_saturation,
            respiration_rate,
            heart_rate,
            distance_travelled,
            temperature
        });

        // 환자의 상태 평가
        const status = await evaluatePatientHealth({
            oxygen_saturation,
            respiration_rate,
            heart_rate,
            temperature
        });

        // 환자의 상태 업데이트
        const patient = await Patient.findByPk(patient_id);
        if (patient) {
            await patient.update({ status });
        }

        res.status(201).json(biometric);
    } catch (error) {
        console.error(error);
        next(error);
    }
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

        // 환자의 최근 7개 생체 정보 조회
        const biometrics = await Biometric.findAll({
            where: { patient_id: patientId },
            order: [['created_at', 'DESC']], // 최신 순으로 정렬
            limit: 7 // 최근 7개만 가져옴
        });

        // 생체 정보의 각 항목별 평균 계산
        const averageBiometrics = {};
        if (biometrics.length > 0) {
            const keys = Object.keys(biometrics[0].dataValues);
            keys.forEach(key => {
                if (key !== 'id' && key !== 'patient_id') {
                    const sum = biometrics.reduce((acc, curr) => acc + curr[key], 0);
                    averageBiometrics[key] = sum / biometrics.length;
                    averageBiometrics[key] = averageBiometrics[key].toFixed(1);
                }
            });
        }
        delete averageBiometrics['created_at'];
        console.log('averageBiometrics:', averageBiometrics);
        
        res.render('profile', { 
        patient,
        biometrics:averageBiometrics,
        chart_data: biometrics
    });
    } catch (err){
        console.error(err);
        next(err);
    }
  });



// 전체 환자 정보 통계 페이지 라우팅
router.get('/chart', async (req, res, next) => {
    try {
        const patients = await Patient.findAll();
        const statusCount = {
            '안전': 0,
            '주의': 0,
            '위험': 0
        };
        const genderCount = {
            '남성': 0,
            '여성': 0,
            '기타': 0
        };
        const ageCount = {
            '10대': 0,
            '20대': 0,
            '30대': 0,
            '40대': 0,
            '50대': 0,
            '60대': 0,
            '70대': 0,
            '80대': 0,
            '90대': 0,
            '100대': 0
        };

        const roomCount = {
            '101': 0,
            '102': 0,
            '103': 0,
            '104': 0,
            '105': 0,
            '106': 0,
            '107': 0,
            '108': 0,
            '109': 0,
            '110': 0
        };
        patients.forEach(patient => {
            statusCount[patient.status]++;
            genderCount[patient.gender]++;
            const age = patient.age;
            if (age < 20) {
                ageCount['10대']++;
            } else if (age < 30) {
                ageCount['20대']++;
            } else if (age < 40) {
                ageCount['30대']++;
            } else if (age < 50) {
                ageCount['40대']++;
            } else if (age < 60) {
                ageCount['50대']++;
            } else if (age < 70) {
                ageCount['60대']++;
            } else if (age < 80) {
                ageCount['70대']++;
            } else if (age < 90) {
                ageCount['80대']++;
            } else {
                ageCount['90대']++;
            } 
            roomCount[patient.room_number]++;
        });

        // FirstchartData: 안전, 주의, 위험 환자 수 표기 차트 데이터
        const FirstchartData = {
            labels: ['안전', '주의', '위험'],
            datasets: [{
                label: '환자 상태',
                backgroundColor: ['rgb(54, 162, 235)',
                                  'rgb(255, 205, 86)',
                                  'rgb(255, 99, 132)'],
                data: [statusCount['안전'], statusCount['주의'], statusCount['위험']]
            }]
        };

        // SecondchartData: 호실별 입원 중인 환자 수 표기 차트 데이터
        const SecondchartData = {
            labels: ['101호', '102호', '103호', '104호', '105호', '106호', '107호', '108호', '109호', '110호'],
            datasets: [{
                label: '방 번호',
                backgroundColor: ['rgb(54, 162, 235)',
                                  'rgb(255, 205, 86)',
                                  'rgb(255, 99, 132)',
                                  'rgb(75, 192, 192)',
                                  'rgb(153, 102, 255)',
                                  'rgb(255, 159, 64)',
                                  'rgb(255, 99, 132)',
                                  'rgb(54, 162, 235)',
                                  'rgb(255, 205, 86)',
                                  'rgb(255, 99, 132)'],
                data: [roomCount['101'], roomCount['102'], roomCount['103'], roomCount['104'], roomCount['105'], roomCount['106'], roomCount['107'], roomCount['108'], roomCount['109'], roomCount['110']]
            }]
        };

        // ThirdchartData: 연령별 환자 수 표기 차트 데이터
        const ThirdchartData = {
            labels: ['10대', '20대', '30대', '40대', '50대', '60대', '70대', '80대', '90대'],
            datasets: [{
                label: '나이대',
                backgroundColor: ['rgb(54, 162, 235)',
                                  'rgb(255, 205, 86)',
                                  'rgb(255, 99, 132)',
                                  'rgb(75, 192, 192)',
                                  'rgb(153, 102, 255)',
                                  'rgb(255, 159, 64)',
                                  'rgb(255, 99, 132)',
                                  'rgb(54, 162, 235)',
                                  'rgb(255, 205, 86)'],
                data: [ageCount['10대'], ageCount['20대'], ageCount['30대'], ageCount['40대'], ageCount['50대'], ageCount['60대'], ageCount['70대'], ageCount['80대'], ageCount['90대'], ageCount['100대']]
            }]
        };

        // FourthchartData: 성별 환자 수 표기 차트 데이터
        const FourthchartData = {
            labels: ['남성', '여성', '기타'],
            datasets: [{
                label: '성별',
                backgroundColor: ['rgb(54, 162, 235)',
                                  'rgb(255, 99, 132)',
                                  'rgb(153, 102, 255)'],
                data: [genderCount['남성'], genderCount['여성'], genderCount['기타']]
            }]
        };

        res.render('chart', { FirstchartData, SecondchartData, ThirdchartData, FourthchartData});

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
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

module.exports = router;