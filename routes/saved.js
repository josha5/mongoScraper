const express = require('express');
const router = express.Router();
const path = require("path");
router.use(express.static(path.join(__dirname, '../public')));
const db = require("../models");

//saved articles route
router.get('/', (req, res)=>{
    db.Article.find({"saved": true}).exec(function(err, savedArt) {
        let hbsObject ={
            article: savedArt
        }
        console.log(hbsObject);
        res.render('index/saved', hbsObject); 
    });
   
});

module.exports = router;