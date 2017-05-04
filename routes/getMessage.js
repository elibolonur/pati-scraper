import express from 'express';
import request from 'request';
import scrapeIt from 'scrape-it';
import { ReqSettings } from '../helpers/requestSettings';
import { ApiResponse } from '../helpers/responseModel';
import Helpers from '../helpers/helperFunctions';
import * as auth from '../helpers/auth/auth.middleware';

const router = express.Router();

// GET specific PM
router.post('/',
    auth.checkApiKey(),
    auth.checkAuthCookie(),
    auth.checkPmID(), function (req, res, next) {

        let url = "https://forum.paticik.com/pm.php?0,page=read,folder_id=inbox,pm_id=" + req.body.pmID;
        let jar = request.jar();
        jar.setCookie(req.body.authCookie, url);

        request.get(ReqSettings.settingsGet(url, jar), function (err, response, body) {
            if (err) {
                res.json(new ApiResponse(false, err));
                return console.error(err.status);
            }

            let scrapedData = scrapeIt.scrapeHTML(Helpers.decode(body), {
                // Fetch message
                pm: {
                    listItem: "table.menu",
                    data: {
                        title: "td.content h4",
                        date: {
                            selector: "td.content",
                            convert: x => Helpers.getDateRegex(x)
                        },
                        time: {
                            selector: "td.content",
                            convert: x => Helpers.getTime(x)
                        },
                        sentBy: {
                            data: {
                                id: {
                                    selector: "td.content a:nth-child(2)",
                                    attr: "href",
                                    convert: x => Helpers.getAfterChar(x, "?")
                                },
                                name: "td.content a:nth-child(2)"
                            }
                        },
                        content: {
                            selector: "td.content div",
                            how: "html",
                            convert: x => Helpers.parsePmBody(x)
                        },
                    }
                }
            });

            res.json(new ApiResponse(true, "Bölüm yüklendi", scrapedData.pm));
        });
    });

module.exports = router;