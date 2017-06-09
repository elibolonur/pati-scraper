import express from 'express';
import scrapeIt from 'scrape-it';
import { ReqSettings } from '../helpers/requestSettings';
import { ApiResponse } from '../helpers/responseModel';
import Helpers from '../helpers/helperFunctions';
import * as auth from '../helpers/auth/auth.middleware';

const router = express.Router();

let url = "https://forum.paticik.com/login.php";

router.post('/', auth.checkApiKey(),function (req, res) {

    let uname = req.body.uname;
    let pass = req.body.pass;

    let request = require('request');
    let jar = request.jar();

    request = request.defaults({
        followAllRedirects: true
    });

    request.get(ReqSettings.settingsGet(url, jar), function () {
        request.post(ReqSettings.loginPost(url, jar, uname, pass), function (_err, _res, _body) {
            if (_err) {
                res.json(new ApiResponse(false, _err));
                return console.error(_err.status);
            }

            let login = scrapeIt.scrapeHTML(Helpers.decode(_body), {
                failed: ".attention"
            });

            if (!login.failed) {
                res.json(new ApiResponse(true, "Giris basarili!", _res.headers['set-cookie'][0]));
            }
            else {
                res.json(new ApiResponse(false, "Bu kullanici adi/sifre bulunamadi. Lütfen tekrar deneyiniz!"));
            }
            // res.send(Helpers.decode(_body));
        });
    });
});

module.exports = router;
