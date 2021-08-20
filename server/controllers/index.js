const express=require('express');
const publicRoute=require('./public/index');
const apiRoute=require('./api/index');
const router=express.Router();

router.use('/',publicRoute);
router.use('/api',apiRoute);

module.exports = router;