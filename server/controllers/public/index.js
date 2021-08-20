const express = require('express');
const loginRoute = require('./login/login');
const coursedataRoute = require('./coursedata/coursedata');
const router=express.Router();

router.use('/',loginRoute);
router.use('/course',coursedataRoute);

module.exports = router;