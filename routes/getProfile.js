import express from 'express';
import request from 'request';
import scrapeIt from 'scrape-it';
import Providers from '../helpers/providers';
import Helpers from '../helpers/helper-functions';

const router = express.Router();

// GET user profile
router.get('/', function (req, res, next) {

    let url = "https://forum.paticik.com/profile.php?20,261236";
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
            // Fetch userprofile
            user: {
                listItem: "table.menu td.odd",
                data: {
                    name: "div strong",
                    epost: {
                        selector: "dl dd",
                        eq: 0
                    },
                    msgCount: {
                        selector: "dl",
                        how: "html",
                        convert: x => Helpers.getMsgCountFromProfile(x)
                    },
                    medals: {
                        selector: "dl",
                        how: "html",
                        convert: x => Helpers.countMedals(x)
                    },
                    memberDate: {
                        selector: "dl",
                        convert: x => Helpers.getDateRegex(x)
                    },
                    memberTime: {
                        selector: "dl",
                        convert: x => Helpers.getTime(x)
                    },
                }
            }
        });

        res.json(scrapedData);
    });
});

module.exports = router;