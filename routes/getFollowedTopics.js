import express from 'express';
import request from 'request';
import scrapeIt from 'scrape-it';
import { ReqSettings } from '../helpers/requestSettings';
import { ApiResponse } from '../helpers/responseModel';
import Helpers from '../helpers/helperFunctions';
import * as auth from '../helpers/auth/auth.middleware';

const router = express.Router();

// Followed topics listing
router.post('/', auth.checkApiKey(), auth.checkAuthCookie(), function (req, res, next) {

    let url = "https://forum.paticik.com/control.php?0,panel=subthreads";
    let jar = request.jar();
    jar.setCookie(req.body.authCookie, url);

    request.get(ReqSettings.settingsGet(url, jar), function (err, response, body) {
        if (err) {
            res.json(new ApiResponse(false, err));
            return console.error(err.status);
        }

        let scrapedData = scrapeIt.scrapeHTML(Helpers.decode(body), {
            // Fetch followed topics
            followedTopics: {
                listItem: "table.list tr",
                data: {
                    topicID: {
                        selector: "td:nth-child(3) a",
                        attr: "href",
                        convert: x => Helpers.getAfterChar(x, "?")
                    },
                    title: "td:nth-child(3) a",
                    area: {
                        data: {
                            name: "td:nth-child(3) small"
                        }
                    },
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
                    },
                    topicType: {
                        selector: "td:nth-child(2) img",
                        attr: "src",
                        convert: x => Helpers.getTopicType(x)
                    }
                }
            }
        });

        res.json(new ApiResponse(true, "Anasayfa yuklendi", scrapedData.followedTopics));
    });


});

module.exports = router;