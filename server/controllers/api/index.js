const express = require('express');
const courseRoute = require('./courses/courses');
const userRoute = require('./users/users');
const router=express.Router();

router.use('/course',courseRoute);
router.use('/user',userRoute);

module.exports = router;