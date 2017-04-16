const express = require('express');
const router = express.Router();
const scrapeIt = require("scrape-it");

const url = "http://www.paticik.com";

// GET Areas listing
router.get('/', function (req, res, next) {

    // Callback interface
    scrapeIt(url, {
        // Fetch the areas
        areas: {
            listItem: ".forum",
            data: {
                areaID: {
                    selector: "td:nth-child(2) a",
                    attr: "href",
                    convert: x => getAreaID(x)
                },
                title: "td:nth-child(2) a",
                description: "td:nth-child(2) small",
                msgCount: "td:nth-child(3)",
                lastMsgBy: "td:nth-child(4) a",
                lastMsgDate: {
                    selector: "td:nth-child(4)",
                    convert: x => x.substring(0, x.indexOf(','))
                }
            }
        }
    }, (err, page) => {
        console.log(err || page);
        res.json(err || page);
    });
});

module.exports = router;

function getAreaID (id) {

    if (id) {
        return id.split("?").pop();
    }
    return id;
}