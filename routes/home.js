const express = require('express');

const homeController = require('../controllers/home');

const router = express.Router();

router.get('/', homeController.getIndex);
router.post('/upload', homeController.upload);
module.exports = router;
