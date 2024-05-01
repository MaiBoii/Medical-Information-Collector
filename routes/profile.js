const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Patient } = require('../models');

const router = express.Router();

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

//이미지 등록 테스트
router.get('/test', (req, res) => {
    res.render('test', { images: imageList });
});

router.post('/img', upload.single('image'), (req, res) => {
    console.log(req.file);
    console.log(req.body);
    res.redirect('/test');
});

module.exports = router;