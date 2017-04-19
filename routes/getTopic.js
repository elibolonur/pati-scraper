import express from 'express';
import scrapeIt from 'scrape-it';
import Helpers from '../helpers/helper-functions';

const router = express.Router();

// GET an area listing
router.get('/', function (req, res, next) {

    // let url = "https://forum.paticik.com/read.php?" + req.params.id;
    let url = "https://forum.paticik.com/read.php?2,8634843";
    // Callback interface
    scrapeIt(url, {
        // Fetch the topics
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
                            convert: x => Helpers.getID(x)
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
                    convert: x => Helpers.cleanMessageContent(x)
                }
            }
        },
        pageCount: {
            selector: ".pati_paging form a",
            eq: 0
        }
    }, (err, page) => {
        console.log(err || page);
        res.json(err || page);
    });

});

module.exports = router;
