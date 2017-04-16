import express from 'express';
import scrapeIt from 'scrape-it';
import Helpers from '../helpers/helper-functions';

const router = express.Router();

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
                    convert: x => Helpers.getID(x)
                },
                title: "td:nth-child(2) a",
                description: "td:nth-child(2) small",
                msgCount: "td:nth-child(3)",
                lastMsg: {
                    data: {
                        date: {
                            selector: "td:nth-child(4)",
                            convert: x => x.substring(0, x.indexOf(','))
                        },
                        time: {
                            selector: "td:nth-child(4)",
                            convert: x => Helpers.getTime(x)
                        },
                        user: {
                            data: {
                                id: {
                                    selector: "td:nth-child(4) a",
                                    attr: "href",
                                    convert: x => Helpers.getID(x)
                                },
                                name: "td:nth-child(4) a"
                            }
                        }
                    }
                }
            }
        }
    }, (err, page) => {
        console.log(err || page);
        res.json(err || page);
    });
});

module.exports = router;