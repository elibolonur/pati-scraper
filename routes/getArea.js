import express from 'express';
import request from 'request';
import scrapeIt from 'scrape-it';
import { ReqSettings } from '../helpers/requestSettings';
import { ApiResponse } from '../helpers/responseModel';
import Helpers from '../helpers/helperFunctions';
import * as auth from '../helpers/auth/auth.middleware';

const router = express.Router();

// Area listing
router.post('/',
    auth.checkApiKey(),
    auth.checkAuthCookie(),
    auth.checkAreaID(), function (req, res, next) {

    let url = "https://forum.paticik.com/list.php?" + req.body.areaID;
    let jar = request.jar();
    jar.setCookie(req.body.authCookie, url);


    request.get(ReqSettings.settingsGet(url, jar), function (err, response, body) {
        if (err) {
            res.json(new ApiResponse(false, err));
            return console.error(err.status);
        }

        let scrapedData = scrapeIt.scrapeHTML(Helpers.decode(body), {
            // Fetch topics in an area
            topics: {
                listItem: ".messagelist tr",
                data: {
                    topicID: {
                        selector: "td:nth-child(2) a:nth-child(2)",
                        attr: "href",
                        convert: x => Helpers.getAfterChar(x, "?")
                    },
                    title: {
                        selector: "td:nth-child(2) a",
                        eq: 1
                    },
                    lastPageQuery: {
                        selector: "td:nth-child(2) a:nth-child(3)",
                        attr: "href",
                        convert: x => Helpers.getBetween(x, "?", "#")
                    },
                    msgCount: "td:nth-child(3)",
                    hasNewMsg: {
                        selector: "td:nth-child(1) img",
                        attr: "src",
                        convert: x => Helpers.hasTopicNewMessage(x)
                    },
                    createdBy: {
                        data: {
                            id: {
                                selector: "td:nth-child(4) a",
                                attr: "href",
                                convert: x => Helpers.getAfterChar(x, "?")
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
                                        convert: x => Helpers.getAfterChar(x, "?")
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
            },
            maxPages: {
                selector: ".pati_paging b",
                eq: 0,
                convert: x => Helpers.getMaxPageValue(x)
            }
        });

        res.json(new ApiResponse(true, "Bölüm yüklendi", scrapedData));
    });


});

module.exports = router;