import express from 'express';
import request from 'request';
import scrapeIt from 'scrape-it';
import { ReqSettings } from '../helpers/requestSettings';
import { ApiResponse } from '../helpers/responseModel';
import Helpers from '../helpers/helperFunctions';
import * as auth from '../helpers/auth/auth.middleware';

const router = express.Router();

// Active topics listing
router.post('/', auth.checkApiKey(), auth.checkAuthCookie(), function (req, res, next) {

    let url = "https://forum.paticik.com/addon.php?0,module=recent_messages";
    let jar = request.jar();
    jar.setCookie(req.body.authCookie, url);

    request.get(ReqSettings.settingsGet(url, jar), function (err, response, body) {
        if (err) {
            res.json(new ApiResponse(false, err));
            return console.error(err.status);
        }

        let scrapedData = scrapeIt.scrapeHTML(Helpers.decode(body), {
            // Fetch active topics
            activeTopics: {
                listItem: "table.list tr",
                data: {
                    topicID: {
                        selector: "td:nth-child(2) a:nth-child(1)",
                        attr: "href",
                        convert: x => Helpers.getBetweenSecond(x, "?", ",")
                    },
                    title: "td:nth-child(2) a:nth-child(1)",
                    hasNewMsg: {
                        selector: "td:nth-child(1) img",
                        attr: "src",
                        convert: x => Helpers.hasTopicNewMessage(x)
                    },
                    newMsgQuery: {
                        selector: "td:nth-child(1) a",
                        attr: "href",
                        convert: x => Helpers.getAfterChar(x, "?")
                    },
                    lastPageQuery: {
                        selector: "td:nth-child(2) a:nth-child(2)",
                        attr: "href",
                        convert: x => Helpers.getAfterChar(x, "?")
                    },
                    lastMsg: {
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
                    },
                    area: {
                        data: {
                            areaID: {
                                selector: "td:nth-child(4) a",
                                attr: "href",
                                convert: x => Helpers.getAfterChar(x, "?")
                            },
                            name: "td:nth-child(4) a"
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

        res.json(new ApiResponse(true, "Anasayfa yuklendi", scrapedData.activeTopics));
    });
});

module.exports = router;