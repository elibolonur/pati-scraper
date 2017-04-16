const express = require('express');
const router = express.Router();
const scrapeIt = require("scrape-it");

const url = "https://forum.paticik.com/list.php?2";

// GET Areas listing
router.get('/', function (req, res, next) {

    // Callback interface
    scrapeIt(url, {
        // Fetch the areas
        topics: {
            listItem: ".messagelist tr",
            data: {
                topicID: {
                    selector: "td:nth-child(2) a:nth-child(2)",
                    attr: "href",
                    convert: x => getID(x)
                },
                title: "td:nth-child(2) a:nth-child(2)",
                lastPageQuery: {
                    selector: "td:nth-child(2) a:nth-child(3)",
                    attr: "href",
                    convert: x => getlastPageQuery(x)
                },
                msgCount: "td:nth-child(3)",
                createdBy: {
                    data: {
                        id: {
                            selector: "td:nth-child(4) a",
                            attr: "href",
                            convert: x => getID(x)
                        },
                        name: "td:nth-child(4)"
                    }
                },
                lastMsg: {
                    data: {
                        date: {
                            selector: "td:nth-child(5)",
                            convert: x => x.substring(0, x.indexOf(','))
                        },
                        time: {
                            selector: "td:nth-child(5)",
                            convert: x => getTime(x)
                        },
                        user: {
                            data: {
                                id: {
                                    selector: "td:nth-child(5) a",
                                    attr: "href",
                                    convert: x => getID(x)
                                },
                                name: "td:nth-child(5) a"
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

function getID(id) {

    if (id) {
        return id.split("?").pop();
    }
    return id;
}

function getlastPageQuery(x) {

    if (x) {
        return x.substring(x.lastIndexOf("?") + 1, x.lastIndexOf("#"));
    }
    return x;
}

function getTime (x) {
    if (x) {
        let match = x.match(/([01]\d|2[0-3]):([0-5]\d)/)[0];
        return match;
    }
    return x;
}