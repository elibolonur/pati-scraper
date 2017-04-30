import express from 'express';
import request from 'request';
import scrapeIt from 'scrape-it';
import { ReqSettings } from '../helpers/requestSettings';
import { ApiResponse } from '../helpers/responseModel';
import Helpers from '../helpers/helperFunctions';
import * as auth from '../helpers/auth/auth.middleware';

const router = express.Router();

// Topic messages listing
router.post('/',
    auth.checkApiKey(),
    auth.checkAuthCookie(),
    auth.checkTopicID(), function (req, res, next) {
// router.get('/', function (req, res, next) {


        let url = "https://forum.paticik.com/read.php?" + req.body.topicID;
        // let url = "https://forum.paticik.com/read.php?6,8098175";

        let jar = request.jar();
        jar.setCookie(req.body.authCookie, url);

        request.get(ReqSettings.settingsGet(url, jar), function (err, response, body) {
            if (err) {
                res.json(new ApiResponse(false, err));
                return console.error(err.status);
            }

            let scrapedData = scrapeIt.scrapeHTML(Helpers.decode(body), {
                // Fetch topic messages
                messages: {
                    listItem: ".readthread tr",
                    data: {
                        messageID: {
                            selector: "td:nth-child(1) a",
                            attr: "name"
                        },
                        postedBy: {
                            data: {
                                id: {
                                    selector: "td:nth-child(1) div a",
                                    attr: "href",
                                    convert: x => Helpers.getAfterChar(x, "?")
                                },
                                name: "td:nth-child(1) div a",
                                title: {
                                    selector: "td:nth-child(1) small",
                                    how: "html",
                                    convert: x => Helpers.getUserTitle(x)
                                },
                                medals: {
                                    selector: "td:nth-child(1) small",
                                    how: "html",
                                    convert: x => Helpers.countMedals(x)
                                }
                            }
                        },
                        date: {
                            selector: "td:nth-child(2) small:nth-child(2)",
                            convert: x => Helpers.getBetweenFirst(x, "§", ",")
                        },
                        time: {
                            selector: "td:nth-child(2) small:nth-child(2)",
                            convert: x => Helpers.getTime(x)
                        },
                        content: {
                            selector: "td:nth-child(2)",
                            how: "html",
                            convert: x => Helpers.parseMsgBody(x)
                        },
                        isNew: {
                            selector: "td:nth-child(2) .pati_newflag",
                            convert: x => Helpers.isPostNew(x)
                        }
                    }
                },
                pageCount: {
                    selector: ".pati_paging form a",
                    eq: 0
                }
            });
            // res.send(JSON.stringify(scrapedData.messages, null, 2));
            res.json(new ApiResponse(true, "Konu yüklendi", scrapedData.messages));
        });
    });

module.exports = router;
