const express = require('express');
const router = express.Router();
const path = require("path");
router.use(express.static(path.join(__dirname, '../public')));

//creating home route
router.get('/', (req, res)=>{
    res.render('index/home'); 
});

 module.exports = router;