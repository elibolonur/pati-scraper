var express = require('express');
var router = express.Router();
// var sc = require('../helpers/scraper');
var scrapeIt = require("scrape-it");

var url = "http://www.paticik.com";

/* GET users listing. */
router.get('/', function (req, res, next) {
    // sc.prototype.scrape(url, {
    //     title: ".pati_navigation td:first-child a:first-child",
    //     description: ".pati_navigation td:nth-child(2) a:nth-child(2)"
    // }, function (err, data) {
    //     console.log(err || data);
    // });

    // Callback interface
    scrapeIt(url, {
        // Fetch the articles
        areas: {
            listItem: ".forum",
            data: {
                title: "td:nth-child(2) a",
                msgCount: "td:nth-child(3)"
                // lastMsgBy: "td:nth-child(4) a",
                // lastMsgDate: "td:nth-child(4)"
                // tags: {
                //     listItem: ".tags > span"
                // },
            }
        }
    }, (err, page) => {
        console.log(err || page);
    });

    res.send('respond with a resource');
});

module.exports = router;


/*

 var express = require('express');
 var router = express.Router();
 const request = require("tinyreq");
 var Iconv = require('iconv').Iconv;

 router.get('/', function(req, res, next) {
 res.send('VästSex Web - REST API');
 });

 router.get('/test', function(req, res, next) {
 request({
 url: "http://paticik.com",
 headers: {
 "user-agent": "Crawler/1.0"
 },
 encoding: "utf-8"
 }, function (err, body) {
 // console.log(err || body);
 res.send( body);
 });
 // res.send('Test');
 });

 function toUTF8(body) {
 var tempBuffer = new Buffer(body, 'ISO-8859-9');
 var iconv = new Iconv('ISO-8859-9', 'UTF-8');
 var n = iconv.convert(tempBuffer);
 console.log(n);
 return n;

 }

 module.exports = router;



 */