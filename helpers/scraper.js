const cheerio = require("cheerio");
const req = require("tinyreq");
var iconv = require('iconv-lite');

function Scraper() { }

Scraper.prototype.scrape = function (url, data, cb) {

    // 1. Get url
    req({
        url: url,
        headers: {
            "user-agent": "Crawler/1.0"
        },
        encoding: null
    }, function (err, body) {
        if (err) { return cb(err); }

        console.log(body);
        // 2. Parse the HTML
        var $ = cheerio.load(iconv.decode(body, 'ISO-8859-9'));
        var pageData = {};

        if (data) {
            Object.keys(data).forEach(function (k) {
                pageData[k] = $(data[k]).text();
            });

            // Send the data in the callback
            cb(null, pageData);
        }
        else {
            cb(null, null);
        }
    });
};

module.exports = Scraper;