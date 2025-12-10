const express = require('express')
const router = express.Router()


const replaceController = require('../controllers/replacer.controller')


router.post('/elementor-replacer', replaceController.replace);


module.exports = router;