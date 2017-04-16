import express from 'express';
import scrapeIt from 'scrape-it';
import Helpers from '../helpers/helper-functions';

const router = express.Router();
const url = "https://forum.paticik.com/list.php?2";

// GET an area listing
router.get('/', function (req, res, next) {

    // Callback interface
    scrapeIt(url, {
        // Fetch the topics
        topics: {
            listItem: ".messagelist tr",
            data: {
                topicID: {
                    selector: "td:nth-child(2) a:nth-child(2)",
                    attr: "href",
                    convert: x => Helpers.getID(x)
                },
                title: "td:nth-child(2) a:nth-child(2)",
                lastPageQuery: {
                    selector: "td:nth-child(2) a:nth-child(3)",
                    attr: "href",
                    convert: x => Helpers.getlastPageQuery(x)
                },
                msgCount: "td:nth-child(3)",
                createdBy: {
                    data: {
                        id: {
                            selector: "td:nth-child(4) a",
                            attr: "href",
                            convert: x => Helpers.getID(x)
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
                            convert: x => Helpers.getTime(x)
                        },
                        user: {
                            data: {
                                id: {
                                    selector: "td:nth-child(5) a",
                                    attr: "href",
                                    convert: x => Helpers.getID(x)
                                },
                                name: "td:nth-child(5) a"
                            }
                        }
                    }
                },
                topicType: {
                    selector: "td:nth-child(1) img",
                    attr: "src",
                    convert: x => Helpers.getTopicType(x)
                }
            }
        }
    }, (err, page) => {
        console.log(err || page);
        res.json(err || page);
    });

});

module.exports = router;