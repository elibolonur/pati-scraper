import express from 'express';
import request from 'request';
import scrapeIt from 'scrape-it';
import { ReqSettings } from '../helpers/requestSettings';
import { ApiResponse } from '../helpers/responseModel';
import Helpers from '../helpers/helperFunctions';
import * as auth from '../helpers/auth/auth.middleware';
import cheerio from 'cheerio';

const router = express.Router();

// Topic messages listing
router.post('/',
    auth.checkApiKey(),
    auth.checkAuthCookie(),
    auth.checkTopicID(),
    function (req, res, next) {

        let Nightmare = require('nightmare');
        let nightmare = Nightmare({ show: false });

        let url = "https://forum.paticik.com/read.php?" + req.body.topicID;
        // let url = "https://forum.paticik.com/read.php?5,8501665";

        nightmare
            .goto(url,{
                Cookie: "phorum_session_v5=" + Helpers.getCookieValue(req.body.authCookie)
            })
            .wait()
            .cookies.get()
            .evaluate(function(){
                function sleep(ms) {
                    var start = new Date().getTime(), expire = start + ms;
                    while (new Date().getTime() < expire) { }
                    return;
                }

                let list = document.querySelectorAll('.bbcode_spoiler_link');
                list.forEach(function(elt){
                    elt.click();
                    sleep(100);
                });
            })
            .evaluate(function(){
                return document.body.innerHTML;
            })
            .end()
            .then(function (body) {

                // Clear unnecessary items
                let ch = cheerio.load(body);
                ch('script').remove();
                ch('.mod_jumpmenu_menu').remove();

                let scrapedData = scrapeIt.scrapeHTML(ch.html(), {
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
            })
            .catch(function (error) {
                res.json(new ApiResponse(false, error));
            });

        // let jar = request.jar();
        // jar.setCookie(req.body.authCookie, url);

        // request.get(ReqSettings.settingsGet(url, jar), function (err, response, body) {
        //     if (err) {
        //         res.json(new ApiResponse(false, err));
        //         return console.error(err.status);
        //     }
        //
        //     let scrapedData = scrapeIt.scrapeHTML(Helpers.decode(body), {
        //         // Fetch topic messages
        //         messages: {
        //             listItem: ".readthread tr",
        //             data: {
        //                 messageID: {
        //                     selector: "td:nth-child(1) a",
        //                     attr: "name"
        //                 },
        //                 postedBy: {
        //                     data: {
        //                         id: {
        //                             selector: "td:nth-child(1) div a",
        //                             attr: "href",
        //                             convert: x => Helpers.getAfterChar(x, "?")
        //                         },
        //                         name: "td:nth-child(1) div a",
        //                         title: {
        //                             selector: "td:nth-child(1) small",
        //                             how: "html",
        //                             convert: x => Helpers.getUserTitle(x)
        //                         },
        //                         medals: {
        //                             selector: "td:nth-child(1) small",
        //                             how: "html",
        //                             convert: x => Helpers.countMedals(x)
        //                         }
        //                     }
        //                 },
        //                 date: {
        //                     selector: "td:nth-child(2) small:nth-child(2)",
        //                     convert: x => Helpers.getBetweenFirst(x, "§", ",")
        //                 },
        //                 time: {
        //                     selector: "td:nth-child(2) small:nth-child(2)",
        //                     convert: x => Helpers.getTime(x)
        //                 },
        //                 content: {
        //                     selector: "td:nth-child(2)",
        //                     how: "html",
        //                     convert: x => Helpers.parseMsgBody(x)
        //                 },
        //                 isNew: {
        //                     selector: "td:nth-child(2) .pati_newflag",
        //                     convert: x => Helpers.isPostNew(x)
        //                 }
        //             }
        //         },
        //         pageCount: {
        //             selector: ".pati_paging form a",
        //             eq: 0
        //         }
        //     });
        //     // res.send(JSON.stringify(scrapedData.messages, null, 2));
        //     res.json(new ApiResponse(true, "Konu yüklendi", scrapedData.messages));
        // });
    });

module.exports = router;
