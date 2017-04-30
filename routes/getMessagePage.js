import express from 'express';
import request from 'request';
import scrapeIt from 'scrape-it';
import { ReqSettings } from '../helpers/requestSettings';
import Helpers from '../helpers/helperFunctions';

const router = express.Router();

// GET messages listing
router.get('/', function (req, res, next) {

    let url = "https://forum.paticik.com/pm.php";
    let jar = request.jar();

    if (req.session.authCookie) {
        jar.setCookie(req.session.authCookie, url);
    }

    request.get(ReqSettings.settingsGet(url, jar), function (err, response, body) {
        if (err) {
            res.render('error', {error: err});
            return console.error(err.status);
        }

        let scrapedData = scrapeIt.scrapeHTML(Helpers.decode(body), {
            // Fetch messages
            messages: {
                listItem: "table.list tr",
                data: {
                    msgID: {
                        selector: "td:nth-child(2) a",
                        attr: "href",
                        convert: x => Helpers.getAfterChar(x, "=")
                    },
                    title: "td:nth-child(2) a",
                    isNew: {
                        selector: "td:nth-child(2) a",
                        how: "html",
                        convert: x => Helpers.isMessageNew(x)
                    },
                    info: {
                        data: {
                            date: {
                                selector: "td:nth-child(3)",
                                convert: x => Helpers.getDateRegex(x)
                            },
                            time: {
                                selector: "td:nth-child(3)",
                                convert: x => Helpers.getTime(x)
                            },
                            user: {
                                data: {
                                    id: {
                                        selector: "td:nth-child(3) a",
                                        attr: "href",
                                        convert: x => Helpers.getAfterChar(x, "?")
                                    },
                                    name: "td:nth-child(3) a"
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