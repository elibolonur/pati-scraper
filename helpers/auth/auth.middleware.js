import { ApiResponse } from '../responseModel';

const apiKey = "16a7cf79db61b9cab7c2563ef949947b818064083ecef72e5899f887814d2bc9";

module.exports = {

    checkApiKey: () => {
        return function (req, res, next) {
            if (req.body.apiKey) {
                if (req.body.apiKey !== apiKey) {
                    res.json(new ApiResponse(false, "You can't access the API outside of the App!"));
                }
                else {
                    return next();
                }
            }
            else {
                res.redirect('/')
            }
            res.redirect('/')
        }
    },

    checkAuthCookie: () => {
        return function (req, res, next) {
            if (!req.body.authCookie) {
                res.json(new ApiResponse(false, "You are not logged in!"));
            }
            else {
                return next();
            }
            res.redirect('/')
        }
    },

    checkAreaID: () => {
        return function (req, res, next) {
            if (!req.body.areaID) {
                res.json(new ApiResponse(false, "Unspecified area!"));
            }
            else {
                return next();
            }
            res.redirect('/')
        }
    },

    checkTopicID: () => {
        return function (req, res, next) {
            if (!req.body.topicID) {
                res.json(new ApiResponse(false, "Unspecified topic!"));
            }
            else {
                return next();
            }
            res.redirect('/')
        }
    }
};