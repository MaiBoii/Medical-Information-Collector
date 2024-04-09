const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: '메인 페이지' });
});

//환자 정보 프로필
router.get('/profile', (req, res) => {
    res.render('profile', { title: '환자 정보 - HealthCare' });
});

//병원 관계자 로그인
router.get('/login', (req, res) => {
    res.render('login', { title: '로그인 - HealthCare' });
});

module.exports = router;