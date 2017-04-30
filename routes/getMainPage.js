import express from 'express';
import request from 'request';
import scrapeIt from 'scrape-it';
import { ReqSettings } from '../helpers/requestSettings';
import { ApiResponse } from '../helpers/responseModel';
import Helpers from '../helpers/helperFunctions';
import * as auth from '../helpers/auth/auth.middleware';


const router = express.Router();
const url = "https://www.paticik.com";

// Areas listing
router.post('/', auth.checkApiKey(), auth.checkAuthCookie(), function (req, res, next) {

    let jar = request.jar();
    jar.setCookie(req.body.authCookie, url);

    // Request
    request.get(ReqSettings.settingsGet(url, jar), function (err, response, body) {
        if (err) {
            res.json(new ApiResponse(false, err));
            return console.error(err.status);
        }

        let scrapedData = scrapeIt.scrapeHTML(Helpers.decode(body), {
            // Fetch areas in main page
            areas: {
                listItem: ".forum",
                data: {
                    areaID: {
                        selector: "td:nth-child(2) a",
                        eq: 2,
                        attr: "href",
                        convert: x => Helpers.getAreaID(x)
                    },
                    areaParent: {
                        selector: "td:nth-child(2) a",
                        eq: 2,
                        attr: "href",
                        convert: x => Helpers.getAreaParent(x)
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

        res.json(new ApiResponse(true, "Anasayfa yuklendi", scrapedData.areas));
        // res.header("Content-Type", 'application/json');
        // res.send(JSON.stringify(scrapedData, null, 2));
        // res.send(Helpers.decode(body));
    });
});

module.exports = router;