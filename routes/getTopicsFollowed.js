import express from 'express';
import request from 'request';
import scrapeIt from 'scrape-it';
import Providers from '../helpers/providers';
import Helpers from '../helpers/helper-functions';

const router = express.Router();

// GET followed topics listing
router.get('/', function (req, res, next) {

    let url = "https://forum.paticik.com/control.php?0,panel=subthreads";
    let jar = request.jar();

    if (req.session.authCookie) {
        jar.setCookie(req.session.authCookie, url);
    }

    request.get(Providers.settingsGet(url, jar), function (err, response, body) {
        if (err) {
            res.render('error', {error: err});
            return console.error(err.status);
        }

        let scrapedData = scrapeIt.scrapeHTML(Helpers.decode(body), {
            // Fetch followed topics
            topics: {
                listItem: "table.list tr",
                data: {
                    topicID: {
                        selector: "td:nth-child(3) a",
                        attr: "href",
                        convert: x => Helpers.getAfterChar(x, "?")
                    },
                    title: "td:nth-child(3) a",
                    area: "td:nth-child(3) small",
                    hasNewMsg: {
                        selector: "td:nth-child(2) img",
                        attr: "src",
                        convert: x => Helpers.hasTopicNewMessage(x)
                    },
                    newMsgQuery: {
                        selector: "td:nth-child(2) a",
                        attr: "href",
                        convert: x => Helpers.getAfterChar(x, "?")
                    },
                    lastMsg: {
                        data: {
                            date: {
                                selector: "td:nth-child(4)",
                                convert: x => x.substring(0, x.indexOf(' '))
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
                                        convert: x => Helpers.getAfterChar(x, "?")
                                    },
                                    name: "td:nth-child(4) a"
                                }
                            }
                        }
                    }
                }
            }
        });

        res.json(scrapedData);
    });


});

module.exports = router;