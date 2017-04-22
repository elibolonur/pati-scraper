import express from 'express';
import request from 'request';
import scrapeIt from 'scrape-it';
import Providers from '../helpers/providers';
import Helpers from '../helpers/helper-functions';

const router = express.Router();

// GET an area listing
router.get('/', function (req, res, next) {

    // let url = "https://forum.paticik.com/list.php?" + req.params.id;
    let url = "https://forum.paticik.com/list.php?2";
    console.log(req.sessionID);
    console.log(req.session.cookie.isLoggedIn);


    request.get(Providers.settingsGet(url), function (err, response, body) {
        if (err) {
            res.render('error', { error: err});
            return console.error(err.status);
        }

        let scrapedData = scrapeIt.scrapeHTML(Helpers.decode(body), {
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
                        convert: x => Helpers.getBetween(x, "?", "#")
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
        });

        res.json(scrapedData);
    });


});

module.exports = router;