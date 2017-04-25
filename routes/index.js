var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});
router.get('/big_screen', function (req, res, next) {
    res.render('big_screen', {title: 'Express'});
});

module.exports = router;
