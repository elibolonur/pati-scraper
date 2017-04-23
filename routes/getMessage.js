import express from 'express';
import request from 'request';
import scrapeIt from 'scrape-it';
import Providers from '../helpers/providers';
import Helpers from '../helpers/helper-functions';

const router = express.Router();

// GET specific message
router.get('/', function (req, res, next) {

    let url = "https://forum.paticik.com/pm.php?0,page=read,folder_id=inbox,pm_id=898695";
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
            // Fetch message
            message: {
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
                        how: "html"
                    },
                }
            }
        });

        res.json(scrapedData);
    });
});

module.exports = router;