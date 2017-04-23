import express from 'express';
import request from 'request';
import scrapeIt from 'scrape-it';
import Providers from '../helpers/providers';
import Helpers from '../helpers/helper-functions';

const router = express.Router();

// GET area listing
router.get('/', function (req, res, next) {

    // let url = "https://forum.paticik.com/read.php?" + req.params.id;
    let url = "https://forum.paticik.com/read.php?5,6267571,page=178";

    let jar = request.jar();
    if (req.session.authCookie)
        jar.setCookie(req.session.authCookie, url);

    request.get(Providers.settingsGet(url, jar), function (err, response, body) {
        if (err) {
            res.render('error', { error: err});
            return console.error(err.status);
        }

        let scrapedData = scrapeIt.scrapeHTML(Helpers.decode(body), {
            // Fetch topics
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
                            title: "td:nth-child(1) small span"
                        }
                    },
                    date: {
                        selector: "td:nth-child(2) small:nth-child(2)",
                        convert: x => Helpers.getBetween(x, "§", ",")
                    },
                    time: {
                        selector: "td:nth-child(2) small:nth-child(2)",
                        convert: x => Helpers.getTime(x)
                    },
                    content: {
                        selector: "td:nth-child(2) .body",
                        how: "html",
                        convert: x => Helpers.clearSignature(x)
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

        res.json(scrapedData);
    });
});

module.exports = router;
