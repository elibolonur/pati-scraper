import express from 'express';
import request from 'request';
import scrapeIt from 'scrape-it';
import Providers from '../helpers/providers';
import Helpers from '../helpers/helper-functions';
import * as auth from '../helpers/auth/auth.middleware';


const router = express.Router();

const url = "https://www.paticik.com";

// GET Areas listing
router.get('/', function (req, res, next) {

    let jar = request.jar();
    if (req.session.authCookie)
        jar.setCookie(req.session.authCookie, url);


    // Request
    request.get(Providers.settingsGet(url, jar), function (err, response, body) {
        if (err) {
            res.render('error', {error: err});
            return console.error(err.status);
        }

        let scrapedData = scrapeIt.scrapeHTML(Helpers.decode(body), {
            // Fetch the areas
            areas: {
                listItem: ".forum",
                data: {
                    areaID: {
                        selector: "td:nth-child(2) a",
                        attr: "href",
                        convert: x => Helpers.getAfterChar(x, "?")
                    },
                    title: "td:nth-child(2) a",
                    description: "td:nth-child(2) small",
                    msgCount: "td:nth-child(3)",
                    hasNewMsg: {
                        selector: "td:nth-child(1) img",
                        attr: "src",
                        convert: x => Helpers.hasTopicNewMessage(x)
                    },
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
        // res.send(Helpers.decode(body));
    });
});

module.exports = router;